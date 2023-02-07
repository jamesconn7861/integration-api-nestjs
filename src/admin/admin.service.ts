import { Injectable } from '@nestjs/common';
import { CachedService } from 'src/cached/cached.service';
import { DbService } from 'src/db/db.service';
import {
  CreateBenchDto,
  CreateVlanDto,
  UpdateBenchDto,
  UpdateVlanDto,
} from './dtos';

@Injectable()
export class AdminService {
  constructor(private db: DbService, private cachedService: CachedService) {}

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
      this.cachedService.updateVlanSchema();
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
      this.cachedService.updateBenchSchema();
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

  async createVlan(dto: CreateVlanDto) {
    const result = await this.db.pool
      .promise()
      .query(
        `insert into vlans (id, name, description, notes, department, protected, visibility) values ?`,
        [
          [
            [
              dto.id,
              dto.name,
              dto.description,
              dto.notes,
              dto.department,
              dto.protected,
              dto.visibility,
            ],
          ],
        ],
      );
    this.cachedService.updateVlanSchema();
    return result;
  }

  async createBench(dto: CreateBenchDto) {
    const result = await this.db.pool
      .promise()
      .query(
        `insert into benches (id, switch, \`range\`, department, notes, locked, visibility) values ?`,
        [
          [
            [
              dto.id,
              dto.switch,
              dto.range,
              dto.department,
              dto.notes,
              dto.locked,
              dto.visibility,
            ],
          ],
        ],
      );

    this.cachedService.updateBenchSchema();
    return result;
  }

  async deleteVlan(vlanId: string) {
    const result = await this.db.pool
      .promise()
      .query(`delete from vlans where id = ?`, [vlanId]);
    this.cachedService.updateVlanSchema();
    return result;
  }

  async deleteBench(benchId: string) {
    const result = await this.db.pool
      .promise()
      .query(`delete from benches where id = ?`, [benchId]);
    this.cachedService.updateBenchSchema();
    return result;
  }
}
