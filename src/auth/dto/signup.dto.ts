import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUp {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
