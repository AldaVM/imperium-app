import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const params = request.params;
    const user = request.user;

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const canAccess = await this.validation(user, url, params);

    if (!canAccess)
      throw new HttpException('Role Unauthorized', HttpStatus.UNAUTHORIZED);

    return canAccess;
  }

  async validation(user: User, currentUrl: string, params: object) {
    const services = await this.prisma.service.findFirst({
      where: {
        url: currentUrl,
      },
    });

    if (!services) return false;

    const serviceId = services.id;
    const serviceURL = services.url;

    const permissions = await this.prisma.permission.findFirst({
      where: {
        rolId: user.rolId,
        serviceId: serviceId,
      },
    });

    if (!permissions) return false;

    if (serviceURL.includes(':')) {
      const tempUrl = serviceURL.split(':');
      const firstPartUrl = tempUrl[0];
      const idParamUrl = tempUrl[1];

      const permissionUrl = firstPartUrl.concat(params[idParamUrl]);

      return permissionUrl == currentUrl;
    }

    return serviceURL == currentUrl;
  }
}
