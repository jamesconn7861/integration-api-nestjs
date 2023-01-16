import { IsNumberString } from 'class-validator';
import {
  IsNotEmpty,
  IsAlpha,
  Matches,
} from 'class-validator/types/decorator/decorators';
import { IsNumber } from 'class-validator/types/decorator/typechecker/IsNumber';

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
