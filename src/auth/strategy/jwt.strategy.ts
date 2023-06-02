import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }

  // async validate(signinDto: SignIn) {
  //   const user =
  //     await this.prisma.user.findUnique({
  //       where: {
  //         id: payload.sub,
  //       },
  //     });
  //   const user = await this.authService.
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   delete user.hash;
  //   return user;
  // }
}

function cookieExtractor(req: any) {
  let token: string = null;
  let secureToken: string = null;
  if (req && req.cookies)
  {
      token = req.cookies['Auth'];
      secureToken = req.signedCookies['Auth'];
  }
  return secureToken || token;
};

