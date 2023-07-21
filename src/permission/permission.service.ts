import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(private primsa: PrismaService) {}

  async createPermission(dto: PermissionDto) {
    try {
      const permission = await this.primsa.permission.create({
        data: {
          rolId: dto.rolId,
          serviceId: dto.serviceId,
        },
      });
      return permission;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code) {
          throw new ForbiddenException(`Error in register ${error.code}`);
        }
      }
      throw error;
    }
  }
}
