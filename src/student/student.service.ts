import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigPaginationDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto, SearchQueryDto, UpdateStudentDto } from './dto';
import { aplicateFormatName } from './utils/student.utils';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async updateStudentById(idStudent: number, data: UpdateStudentDto) {
    const student = await this.prisma.student.update({
      where: {
        id: idStudent,
      },
      data: data,
    });

    return student;
  }

  async getTotalsStudents(where?: object) {
    const totals = await this.prisma.student.count({
      where: where,
    });

    return totals;
  }

  async getStudent(where: object) {
    const student = await this.prisma.student.findFirst({
      where: where,
    });

    if (!student) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return student;
  }

  // Get student by email or fullName or document
  async searchStudent(
    configPage: ConfigPaginationDto,
    queryParams: SearchQueryDto,
  ) {
    const listTypes = ['email', 'fullName', 'document'];
    let valueToFind = queryParams.value;

    const foundType = listTypes.find((type) => type === queryParams.type);

    if (!foundType) {
      throw new NotFoundException(
        'Tipo de filtro invalido, las opciones son: email, fullName o document',
      );
    }

    if (foundType === 'fullName') {
      valueToFind = aplicateFormatName(valueToFind);
    }

    const where = {
      [foundType]: {
        contains: valueToFind,
      },
    };

    const students = await this.prisma.student.findMany({
      skip: configPage.skip,
      take: configPage.take,
      where: where,
    });
    return students;
  }

  async getAllStudents(configPage: ConfigPaginationDto, where?: object) {
    const students = await this.prisma.student.findMany({
      skip: configPage.skip,
      take: configPage.take,
      where: where,
    });
    return students;
  }

  async createStudent(dto: CreateStudentDto) {
    const isRegisterStudent = await this.prisma.student.findFirst({
      where: { documentId: dto.documentId },
    });

    if (isRegisterStudent) {
      throw new ForbiddenException('El usuario existe');
    }

    const firstNameWithFormat = aplicateFormatName(dto.firstName);
    const lastNameWithFormat = aplicateFormatName(dto.lastName);

    const fullName = `${firstNameWithFormat} ${lastNameWithFormat}`;

    const student = await this.prisma.student.create({
      data: {
        firstName: firstNameWithFormat,
        lastName: lastNameWithFormat,
        fullName: fullName,
        documentId: dto.documentId,
        phone: dto.phone,
      },
    });
    return student;
  }
}
