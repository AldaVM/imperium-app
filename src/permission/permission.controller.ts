import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PermissionDto } from './dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionServices: PermissionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPermission(@Body() dto: PermissionDto) {
    const permission = await this.permissionServices.createPermission(dto);

    return {
      data: permission,
    };
  }
}
