import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolDto } from './dto';

@Injectable()
export class RolService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const idRole = Number(id);

    const rol = await this.prisma.rol.findUnique({
      where: {
        id: idRole,
      },
    });

    if (!rol) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);

    return rol;
  }

  async createRol(dto: RolDto) {
    const rol = await this.prisma.rol.create({
      data: {
        name: dto.name,
        description: dto.description || "Don't detail",
      },
    });
    return rol;
  }

  async getAllRoles() {
    const roles = await this.prisma.rol.findMany();
    return roles;
  }
}
