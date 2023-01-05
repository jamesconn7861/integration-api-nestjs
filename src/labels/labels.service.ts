import { Inject, Injectable } from '@nestjs/common';
import { MYSQL_CONN } from 'src/constants';
import { DbService } from 'src/db/db.service';
import { LabelData } from './dtos';

@Injectable()
export class LabelsService {
  constructor(private db: DbService) {}

  async getByUserAndTable(tableId: string, userId: string) {
    const [rows, _fields] = await this.db.pool
      .promise()
      .query(`select * from ${tableId} where username = ?`, [userId]);
    return [rows];
  }

  async uploadLabels(labelData: LabelData) {
    const conn = await this.db.pool.promise().getConnection();

    await conn.query(`delete from ${labelData.table} where username = ?`, [
      labelData.user,
    ]);

    const insertResult = await conn.query(
      `insert into ${labelData.table} (${labelData.columns}) values ?`,
      [labelData.rows],
    );

    this.db.pool.releaseConnection(conn);

    return insertResult;
  }
}
