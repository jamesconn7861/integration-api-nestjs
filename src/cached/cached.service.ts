import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db/db.service';
import * as fs from 'fs';

@Injectable()
export class CachedService implements OnModuleInit {
  vlanSchema: any;
  switchSchema: any;
  tableSchema: any;
  constructor(private db: DbService) {}

  onModuleInit() {
    this.updateCachedData();
  }

  async updateCachedData() {
    this.tableSchema = JSON.parse(
      fs.readFileSync(__dirname + '../../../tableSchema.json').toString(),
    );

    const conn = await this.db.pool.promise().getConnection();

    let test = 5;
    let [rows, fields] = await conn.query('Select * from `vlans`');
    this.vlanSchema = rows;

    [rows, fields] = await conn.query('Select * from `benches`');
    this.switchSchema = rows;

    this.db.pool.releaseConnection(conn);
  }

  async getAppInitData() {
    return {
      tableSchema: this.tableSchema,
      vlanSchema: this.vlanSchema,
      switchSchema: this.switchSchema,
    };
  }
}
