import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CreateBenchDto,
  CreateVlanDto,
  UpdateBenchDto,
  UpdateVlanDto,
} from './dtos';

@Injectable()
export class AdminService {
  constructor(private db: DbService) {}

  async updateVlan(updateVlanDto: UpdateVlanDto) {
    const queryArray: string[] = [];

    Object.keys(updateVlanDto).forEach((oKey: string) => {
      if (oKey != 'oldId') {
        if (typeof updateVlanDto[oKey] == 'string') {
          queryArray.push(`${oKey} = "${updateVlanDto[oKey]}"`);
        } else {
          queryArray.push(`${oKey} = ${updateVlanDto[oKey]}`);
        }
      }
    });

    const queryString = `update vlans set ${queryArray.join(
      ', ',
    )} where id = ?`;

    const [results] = await this.db.pool
      .promise()
      .query(queryString, [updateVlanDto.oldId]);

    if (+results['changedRows'] > 0 && +results['affectedRows'] > 0) {
      return results;
    } else if (+results['affectedRows'] > 0) {
      return {
        message: 'Row already contains requested data. No changes made.',
      };
    } else if (+results['affectedRows'] == 0) {
      return {
        message: 'Vlan not found.',
      };
    }
  }

  async updateBench(updateBenchDto: UpdateBenchDto) {
    const queryArray: string[] = [];

    Object.keys(updateBenchDto).forEach((oKey: string) => {
      if (oKey != 'oldId') {
        if (typeof updateBenchDto[oKey] == 'string') {
          if (oKey == 'range') {
            queryArray.push(`\`${oKey}\` = "${updateBenchDto[oKey]}"`);
          } else {
            queryArray.push(`${oKey} = "${updateBenchDto[oKey]}"`);
          }
        } else {
          queryArray.push(`${oKey} = ${updateBenchDto[oKey]}`);
        }
      }
    });

    const queryString = `update benches set ${queryArray.join(
      ', ',
    )} where id = ?`;

    console.log(queryString);

    const [results] = await this.db.pool
      .promise()
      .query(queryString, [updateBenchDto.oldId]);

    if (+results['changedRows'] > 0 && +results['affectedRows'] > 0) {
      return results;
    } else if (+results['affectedRows'] > 0) {
      return {
        message: 'Row already contains requested data. No changes made.',
      };
    } else if (+results['affectedRows'] == 0) {
      return {
        message: 'Bench not found.',
      };
    }
  }

  async createVlan(createVlanDto: CreateVlanDto) {
    return await this.db.pool.query(
      `insert into vlans (id, name, description, notes, department, protected, visibility) values ?`,
      [createVlanDto],
    );
  }

  async createBench(createBenchDto: CreateBenchDto) {
    return await this.db.pool.query(
      `insert into benches (id, switch, \`range\`, department, notes, locked, visibility) values ?`,
      [createBenchDto],
    );
  }

  async deleteVlan(vlanId: string) {
    return await this.db.pool.query(`delete from vlans where id = ?`, [vlanId]);
  }

  async deleteBench(benchId: string) {
    return await this.db.pool.query(`delete from benches where id = ?`, [
      benchId,
    ]);
  }
}
