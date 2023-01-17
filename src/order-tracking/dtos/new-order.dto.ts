import {
  IsNotEmpty,
  IsNumber,
  IsAlpha,
  Matches,
  IsArray,
} from 'class-validator';

export class NewOrderDto {
  @IsNotEmpty()
  @IsArray()
  orderNumbers: number[];

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
