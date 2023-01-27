import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignIn {
  @ValidateIf((o) => !o.email || o.username)
  @IsString()
  @MinLength(3)
  username?: string;

  @ValidateIf((o) => !o.username || o.email)
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
