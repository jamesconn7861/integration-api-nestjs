// TODO Add class-validation decoration

import { IsAlpha, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class LabelData {
  @IsNotEmpty()
  @IsAlpha()
  user: string;

  @IsNotEmpty()
  @IsString()
  table: string;

  @IsNotEmpty()
  @IsArray()
  columns: [];

  @IsNotEmpty()
  @IsArray()
  rows: any[][];
}
