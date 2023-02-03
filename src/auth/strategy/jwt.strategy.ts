import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from '../../db/db.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
