import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateVlanDto } from './createVlan.dto';
import { VisibilityEnum } from './visibilityEnums';

export class UpdateVlanDto extends CreateVlanDto {
  @IsString()
  oldId: string;
}
