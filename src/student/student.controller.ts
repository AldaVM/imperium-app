import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDto, SearchQueryDto } from './dto';
import { StudentService } from './student.service';
import { JwtGuard } from 'src/auth/guard';
import { PermissionGuard } from 'src/permission/guard';
import { ConfigPaginationDto, QueryPaginationDto } from 'src/dto';

// @UseGuards(JwtGuard, PermissionGuard)
@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getStudents(
    @Query() queryParams: QueryPaginationDto,
    @Body() where: object,
  ) {
    const parsedPage = parseInt(queryParams.page) || 1;
    const parsedLimit = parseInt(queryParams.limit) || 10;

    const skip = (parsedPage - 1) * parsedLimit;

    const configPag: ConfigPaginationDto = {
      skip: skip,
      take: parsedLimit,
    };

    const students = await this.studentService.getAllStudents(configPag, where);
    const totalsStudents = await this.studentService.getTotalsStudents();
    let countPages = Math.round(totalsStudents / parsedLimit);
    const lastPage = parsedLimit * countPages < totalsStudents ? 1 : 0;
    countPages += lastPage;

    return {
      data: students,
      countPages,
    };
  }

  @Get('search')
  async searchStudent(@Query() queryParams: SearchQueryDto) {
    const parsedPage = parseInt(queryParams.page) || 1;
    const parsedLimit = parseInt(queryParams.limit) || 10;

    const skip = (parsedPage - 1) * parsedLimit;

    const configPag: ConfigPaginationDto = {
      skip: skip,
      take: parsedLimit,
    };

    const student = await this.studentService.searchStudent(
      configPag,
      queryParams,
    );

    return {
      data: student,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-by-document/:document')
  async getStudentByDocumentId(@Param() params: any) {
    const where = {
      documentId: params.document,
    };
    const student = await this.studentService.getStudent(where);

    return {
      data: student,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async createStudent(@Body() dto: CreateStudentDto) {
    const student = await this.studentService.createStudent(dto);

    return {
      data: student,
    };
  }
}
