import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VisibilityEnum } from './vlanEnums';

export class CreateBenchDto {
  @IsString()
  id: string;

  @IsNumber()
  switch: number;

  @IsString()
  range: string;

  @IsString()
  department: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  locked: string;

  // @IsNumber()
  // @IsEnum(VisibilityEnum)
  @IsOptional()
  visibility: string | number;
}
