import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DepartmentEnum, ProtectionEnum, VisibilityEnum } from './vlanEnums';

export class CreateVlanDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsOptional()
  // @Transform(({ value }) => isNaN(value) ? DepartmentEnum[value] : value)
  // @IsEnum(DepartmentEnum)
  department: string | number;

  @IsOptional()
  // @Transform(({ value }) => (isNaN(value) ? ProtectionEnum[value] : value))
  // @IsEnum(ProtectionEnum)
  protected: string | number;

  @IsOptional()
  // @Transform(({ value }) => (isNaN(value) ? VisibilityEnum[value] : value))
  // @IsEnum(VisibilityEnum)
  visibility: string | number;
}
