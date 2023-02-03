import { Injectable } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { User } from './types/user';

@Injectable()
export class AuthService {
  constructor(private dbService: DbService, private jwtService: JwtService) {}

  async validateUser(signInDto: SignInDto) {
    // Decide if user used email or username to login
    const queryString = signInDto.email
      ? 'select distinct * from users where email = ?'
      : 'select distinct * from users where username = ?';

    const [records] = await this.dbService.pool
      .promise()
      .query(
        queryString,
        signInDto.email
          ? signInDto.email.toLowerCase()
          : signInDto.username.toLowerCase(),
      );

    if ((records as []).length == 0) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const user = records[0];

    // compare password
    const pwMatches = await argon.verify(user.hash, signInDto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return user;
  }

  async signup(dto: SignUpDto) {
    // genereate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const [res, _] = await this.dbService.pool
        .promise()
        .query(`insert into users (username, email, hash) values ?`, [
          [[dto.username.toLowerCase(), dto.email.toLowerCase(), hash]],
        ]);

      const userId = res.insertId;

      return {
        access_token: await this.jwtService.signAsync({
          username: dto.username,
          sub: userId,
        }),
        userId,
      };
    } catch (error) {
      throw new ForbiddenException('Credentials already taken.');
    }
  }

  async signin(signInDto: SignInDto) {
    const user: User = await this.validateUser(signInDto);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        level: user.level,
      },
    };
  }
}
