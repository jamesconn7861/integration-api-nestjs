import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import * as fs from 'fs';
import {
  SwitchObject,
  TableObject,
  ColumnProperties,
  VlanObject,
} from './types';

/*
The name of the class is a little misleading
This isn't actually cached data, but data that
doesn't change very often. This class holds
the vlan, switch and table schema so that
we don't have to query the db each time.

If this class does need updated and you
don't want to restart the whole application,
Send a request to '/update-app-data' with body:
'pass': 'upd@t3'. It's not super secure, but it
prevents things from being updated unintentionally.
*/

@Injectable()
export class CachedService {
  constructor(private db: DbService) {
    this.updateCachedData();
  }

  vlanSchema: VlanObject[] = [];
  switchSchema: SwitchObject[] = [];
  tableSchema: TableObject[] = [];

  async updateCachedData() {
    this.vlanSchema = [];
    this.switchSchema = [];
    this.tableSchema = [];

    const env = process.env.NODE_ENV || 'dev';
    const filePath: string =
      env == 'dev' ? '../../../tableSchema.json' : '/../../tableSchema.json';

    const tableSchemaData = JSON.parse(
      fs.readFileSync(__dirname + filePath).toString(),
    );

    tableSchemaData['tables'].forEach((table: any) => {
      table['columns'] = table['columns'] as ColumnProperties;
      this.tableSchema.push(table as TableObject);
    });

    const conn = await this.db.pool.promise().getConnection();

    let [rows, _fields] = await conn.query('Select * from `vlans`');

    rows.forEach((row: Partial<VlanObject>) => {
      this.vlanSchema.push(row as VlanObject);
    });

    [rows, _fields] = await conn.query('Select * from `benches`');

    rows.forEach((row: Partial<SwitchObject>) => {
      this.switchSchema.push(row as SwitchObject);
    });

    this.db.pool.releaseConnection(conn);
  }

  async updateBenchSchema() {
    this.switchSchema = [];

    const [rows, _fields] = await this.db.pool
      .promise()
      .query('Select * from `benches`');

    rows.forEach((row: Partial<SwitchObject>) => {
      this.switchSchema.push(row as SwitchObject);
    });
  }

  async updateVlanSchema() {
    this.vlanSchema = [];

    const [rows, _fields] = await this.db.pool
      .promise()
      .query('Select * from `vlans`');

    rows.forEach((row: Partial<VlanObject>) => {
      this.vlanSchema.push(row as VlanObject);
    });
  }

  getAppInitData() {
    return {
      tableSchema: this.tableSchema,
      vlanSchema: this.vlanSchema,
      switchSchema: this.switchSchema,
    };
  }

  getBenchSchema(): SwitchObject[] {
    return this.switchSchema;
  }

  getBenchSchemaById(benchId: string | number): SwitchObject {
    if (typeof benchId == 'string') {
      return this.switchSchema.find(
        (bench) => bench.id.toLowerCase() === benchId.toString().toLowerCase(),
      );
    } else {
      return this.switchSchema.find((bench) => bench.switch === benchId);
    }
  }

  getVlanSchema(): VlanObject[] {
    return this.vlanSchema;
  }

  getVlanSchemaById(vlanId: string | number): VlanObject {
    if (typeof vlanId == 'string') {
      return this.vlanSchema.find((vlan) =>
        vlan.name.toLowerCase().includes(vlanId.toLowerCase()),
      );
    } else {
      return this.vlanSchema.find((vlan) => vlan.id === vlanId);
    }
  }

  getCachedData(dataKey: string) {
    return this[dataKey];
  }
}
