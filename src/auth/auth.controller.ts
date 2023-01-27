import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { SignUp, SignIn } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() dto: SignUp,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.signup(dto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() dto: SignIn,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.signin(dto, response);
  }
}
