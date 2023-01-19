import {
  IsAlpha,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { StatusCodes } from '../enums/statusCodes.enum';

export class EditOrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsAlpha()
  @IsNotEmpty()
  user: string;

  @IsOptional()
  @Matches(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/,
  )
  completedAt: string;

  // 1 = completed, 2 = active, 3 = error
  @IsOptional()
  @IsEnum(StatusCodes)
  status: number;

  @IsOptional()
  @IsString()
  note: string;
}
