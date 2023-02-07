import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VisibilityEnum } from './visibilityEnums';

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

  @IsNumber()
  @IsOptional()
  department: number;

  @IsNumber()
  @IsOptional()
  protected: number;

  @IsNumber()
  @IsEnum(VisibilityEnum)
  visibility: VisibilityEnum;
}
