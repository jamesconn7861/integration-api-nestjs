import { IsString } from 'class-validator';
import { CreateBenchDto } from './createBench.dto';

export class UpdateBenchDto extends CreateBenchDto {
  @IsString()
  oldId: string;
}
