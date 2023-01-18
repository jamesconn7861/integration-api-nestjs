import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class EditOrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsAlpha()
  @IsNotEmpty()
  tech: string;

  @IsOptional()
  @Matches(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/,
  )
  endTime: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => !!value)
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => !!value)
  hasIssue: boolean;

  @IsOptional()
  @IsString()
  note: string;
}
