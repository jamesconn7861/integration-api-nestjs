import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { SignUp, SignIn } from './dto';

@Controller('auth')
export class AuthController {
  cookieParams: {};
  constructor(private authService: AuthService) {
    this.cookieParams = {
      domain: 'integration-toolkit.pomeroy.com',
      path: '/',
      secure: true,
      httpOnly: true,
      expires: new Date(new Date().setHours(new Date().getHours() + 24)),
    };
  }

  @Post('signup')
  async signup(
    @Body() dto: SignUp,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const result = await this.authService.signin(dto);

    response.setCookie('access_token', result.access_token, this.cookieParams);
    response.setCookie('current_user', result.user.username, this.cookieParams);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SignIn,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const result = await this.authService.signin(dto);

    response.setCookie('access_token', result.access_token, this.cookieParams);
    response.setCookie('current_user', result.user.username, this.cookieParams);

    return result;
  }
}
