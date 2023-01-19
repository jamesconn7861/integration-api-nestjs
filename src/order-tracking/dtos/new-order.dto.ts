import {
  IsNotEmpty,
  IsNumber,
  IsAlpha,
  Matches,
  IsArray,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { StatusCodes } from '../enums/statusCodes.enum';

export class NewOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  orderIds: number[];

  @IsAlpha()
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @Matches(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/,
  )
  createdAt: string;

  // 1 = completed, 2 = active, 3 = error
  @IsNumber()
  @IsEnum(StatusCodes)
  status: number = 2;
}
