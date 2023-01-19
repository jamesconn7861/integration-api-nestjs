// TODO Add class-validation decoration

import { IsAlpha, IsArray, IsNotEmpty } from 'class-validator';

export class LabelData {
  @IsNotEmpty()
  @IsAlpha()
  user: string;

  @IsNotEmpty()
  @IsAlpha()
  table: string;

  @IsNotEmpty()
  @IsArray()
  columns: [];

  @IsNotEmpty()
  @IsArray()
  rows: any[][];
}
