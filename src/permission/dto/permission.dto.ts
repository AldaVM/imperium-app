import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PermissionDto {
  @IsNumber()
  @IsNotEmpty()
  rolId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;
}
