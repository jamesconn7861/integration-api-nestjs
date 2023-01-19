import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { EditOrderDto, NewOrderDto } from './dtos';
import { DeleteOrderDto } from './dtos/delete-order.dto';

@Injectable()
export class OrderTrackingService {
  constructor(private db: DbService) {}

  async getOrdersByUser(userId: string, status: number[]) {
    let queryString: string;

    if (userId === 'all') {
      queryString = `select * from integrationdb.order_tracking where status in (${status}) Limit 500`;
    } else {
      queryString = `select * from integrationdb.order_tracking where user = '${userId}' and status in (${status}) Limit 500`;
    }

    const [rows, _fields] = await this.db.pool.promise().query(queryString);
    return [rows];
  }

  async getOrderById(orderId: number) {
    const [rows, _fields] = await this.db.pool
      .promise()
      .query('select * from `order_tracking` where orderId = ?', [orderId]);
    return [rows];
  }

  async uploadOrders(dto: NewOrderDto) {
    let queryString: string;
    let queryArray: any[][] = [];

    dto.orderIds.forEach((orderId: number) => {
      queryArray.push([orderId, dto.user, dto.createdAt, dto.status]);
    });

    if (dto.orderIds.length > 1) {
      queryString =
        'insert ignore into `order_tracking` (orderId, user, createdAt, status) values ?';
    } else {
      queryString =
        'insert into `order_tracking` (orderId, user, createdAt, status) values ?';
    }

    return await this.db.pool.promise().query(queryString, [queryArray]);
  }

  async updateOrder(dto: EditOrderDto) {
    let queryArray: string[] = [];

    Object.keys(dto).forEach((oKey: string) => {
      if (!['orderId', 'user', 'createdAt'].includes(oKey)) {
        if (typeof dto[oKey] == 'string') {
          queryArray.push(`${oKey} = "${dto[oKey]}"`);
        } else {
          queryArray.push(`${oKey} = ${dto[oKey]}`);
        }
      }
    });

    let queryString: string = `update integrationdb.order_tracking set ${queryArray.join(
      ', ',
    )} where orderId = ? and user = ?`;

    const [results, _err] = await this.db.pool
      .promise()
      .query(queryString, [dto.orderId, dto.user]);

    if (+results['changedRows'] > 0 && +results['affectedRows'] > 0) {
      return results;
    } else if (+results['affectedRows'] > 0) {
      return {
        message: 'Row already contains requested data. No changes made.',
      };
    } else if (+results['affectedRows'] == 0) {
      return {
        message: 'Order not found. This is likely due to a invalid username.',
      };
    }
  }

  async deleteOrderById(dto: DeleteOrderDto) {
    return await this.db.pool
      .promise()
      .query('delete from `order_tracking` where orderId in (?) and user = ?', [
        dto.orderIds.join(', '),
        dto.user,
      ]);
  }
}
