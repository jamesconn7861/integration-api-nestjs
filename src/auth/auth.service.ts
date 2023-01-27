import { Injectable } from '@nestjs/common';
import { SignIn, SignUp } from './dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { DbService } from 'src/db/db.service';
import fastify, { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUp, res: FastifyReply) {
    // genereate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const [res, _] = await this.dbService.pool
        .promise()
        .query(`insert into users (username, email, hash) values ?`, [
          [[dto.username, dto.email, hash]],
        ]);

      const userId = res.insertId;

      const accessToken = (await this.signToken(userId, dto.email))
        .access_token;

      res.setCookie('access_token', accessToken);
      res.setCookie('current_user', dto.username);

      return {
        access_token: accessToken,
        user: { id: userId, username: dto.username, email: dto.email },
      };
    } catch (error) {
      throw new ForbiddenException('Credentials already taken.');
    }
  }

  async signin(dto: SignIn, res: FastifyReply) {
    // find the user by email
    const queryString = dto.email
      ? 'select distinct * from users where email = ?'
      : 'select distinct * from users where username = ?';

    const [records, _] = await this.dbService.pool
      .promise()
      .query(queryString, dto.email || dto.username);
    const user = records[0];
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    delete user.hash;

    const accessToken = (await this.signToken(user.id, user.email))
      .access_token;

    res.setCookie('access_token', accessToken);
    res.setCookie('current_user', dto.username);

    return { access_token: accessToken, user };
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
