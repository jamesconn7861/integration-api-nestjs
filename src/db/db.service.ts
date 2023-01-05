import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2';

@Injectable()
export class DbService {
  constructor(config: ConfigService) {
    this.pool = createPool({
      host: config.get('DB_HOST'),
      database: config.get('DB_DATABASE'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASS'),
      port: config.get('DB_PORT'),
      connectionLimit: config.get('DB_CONNLIMIT'),
    });
  }

  pool: any;
}
