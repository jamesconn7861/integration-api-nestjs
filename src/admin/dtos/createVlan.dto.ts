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
  @IsEnum(DepartmentEnum)
  department: DepartmentEnum = DepartmentEnum.Universal;

  @IsOptional()
  @IsEnum(ProtectionEnum)
  protected: ProtectionEnum = ProtectionEnum.Unprotected;

  @IsOptional()
  @IsEnum(VisibilityEnum)
  visibility: VisibilityEnum = VisibilityEnum.Visible;
}
