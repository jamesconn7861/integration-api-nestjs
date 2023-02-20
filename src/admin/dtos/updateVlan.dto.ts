import { IsString } from 'class-validator';
import { CreateVlanDto } from './createVlan.dto';

export class UpdateVlanDto extends CreateVlanDto {
  @IsString()
  oldId: string;
}
