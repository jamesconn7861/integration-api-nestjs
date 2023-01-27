import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from '../../db/db.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private dbService: DbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number; email: string }) {
    // const user =
    //   await this.prisma.user.findUnique({
    //     where: {
    //       id: payload.sub,
    //     },
    //   });
    const user = await this.dbService.pool
      .promise()
      .query('select * from users where id = ?', [payload.id]);
    delete user.hash;
    return user;
  }
}
