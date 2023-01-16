import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2';

/*
  db connection service.
  In testing/dev enviroments, use tcp/ip
  In production enviroments, use unix socket
*/

@Injectable()
export class DbService {
  pool: any;
  constructor(config: ConfigService) {
    /* 
    These values are hosted in the .env files.
    DO NOT UPLOAD SECURE CREDENTIALS TO GITHUB!
    IS NO GOOD, CREDENTIALS IMPORTANT, SOMETIMES
    */

    this.pool = createPool({
      host: config.get('DB_HOST'),
      database: config.get('DB_DATABASE'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASS'),
      port: config.get('DB_PORT'),
      connectionLimit: config.get('DB_CONNLIMIT'),
    });
  }
}
