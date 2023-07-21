import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolDto } from './dto';
import { RolService } from './rol.service';
import { JwtGuard } from 'src/auth/guard';
import { PermissionGuard } from 'src/permission/guard';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('roles')
export class RolController {
  constructor(private rolService: RolService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async get() {
    const roles = await this.rolService.getAllRoles();
    return {
      data: roles,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(@Param() params: any) {
    const roles = await this.rolService.getById(params.id);
    return {
      data: roles,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createRol(@Body() dto: RolDto) {
    const rol = await this.rolService.createRol(dto);
    return {
      data: rol,
    };
  }
}
