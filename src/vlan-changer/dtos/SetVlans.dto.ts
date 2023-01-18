// TODO add class-validation decorators

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class SetVlansDto {
  @IsNotEmpty()
  @IsAlpha()
  user: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  ports: [number, number];

  @IsNotEmpty()
  vlan: string | number;

  @IsNotEmpty()
  benchId: string | number;
}
