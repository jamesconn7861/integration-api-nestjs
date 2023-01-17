import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class EditOrderDto {
  @IsNumberString()
  @IsNotEmpty()
  orderNumber: number;

  @IsAlpha()
  @IsNotEmpty()
  tech: string;

  @Matches(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/,
  )
  endTime: string;

  @IsBoolean()
  @Transform(({ value }) => !!value)
  isActive: number;

  @IsBoolean()
  @Transform(({ value }) => !!value)
  hasIssue: number;

  @IsString()
  note: string;
}
