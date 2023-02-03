import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }
}
