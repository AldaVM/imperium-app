import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsNotEmpty()
  limit: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  value?: string;
}

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  documentId?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  sedeId?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  photo?: string;
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  documentId: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNumber()
  @IsOptional()
  sedeId?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  photo?: string;
}
