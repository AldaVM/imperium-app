import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfigPaginationDto {
  @IsNumber()
  @IsNotEmpty()
  skip: number;

  @IsNumber()
  @IsNotEmpty()
  take: number;
}

export class QueryPaginationDto {
  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsNotEmpty()
  limit: string;
}
