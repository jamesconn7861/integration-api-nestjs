import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async getUser(userId: String) {
    const [userData, _] = await this.dbService.pool
      .promise()
      .query(`select * from users where username = ?`, [userId]);

    if ((userData as []).length == 0) {
      throw new UnauthorizedException('User not found.');
    }

    delete userData[0].hash;
    return userData[0];
  }
}
