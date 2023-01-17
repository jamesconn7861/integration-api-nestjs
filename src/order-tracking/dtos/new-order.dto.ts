import {
  IsNumberString,
  IsNotEmpty,
  IsNumber,
  IsAlpha,
  Matches,
} from 'class-validator';

export class NewOrderDto {
  @IsNotEmpty()
  @IsNumberString()
  orderNumber: number;

  @IsAlpha()
  @IsNotEmpty()
  tech: string;

  @IsNotEmpty()
  @Matches(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/,
  )
  startTime: string;

  @IsNumber()
  isActive: number = 1;

  @IsNumber()
  hasIssue: number = 0;
}
