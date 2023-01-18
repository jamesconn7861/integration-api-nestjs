// TODO Probably not worth creating the class. Might delete.

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBody {
  @IsNotEmpty()
  @IsString()
  pass: string;
}
