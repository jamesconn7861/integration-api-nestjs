import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import type { FastifyReply } from 'fastify'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Res({ passthrough: true }) response: FastifyReply, @Body() dto: SignUpDto) {
    const signupResults = await this.authService.signup(dto);
    if (signupResults.access_token) {
      response.setCookie('Auth', signupResults.access_token, {httpOnly: true, maxAge: 10800})
    }
    return signupResults;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Res({ passthrough: true }) response: FastifyReply, @Body() dto: SignInDto) {
    const signinResults = await this.authService.signin(dto);
    if (signinResults.access_token) {
      response.setCookie('Auth', signinResults.access_token, {httpOnly: true, maxAge: 10800})
    }
    return signinResults;
  }
}
