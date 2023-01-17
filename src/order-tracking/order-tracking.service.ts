import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { EditOrderDto, NewOrderDto } from './dtos';
import { OrderArrayDto } from './dtos/order-array.dto';

@Injectable()
export class OrderTrackingService {
  constructor(private db: DbService) {}

  async getOrdersByUser(userId: string, isActive: string) {
    let queryString: string;

    if (userId === 'all') {
      queryString = `select * from integrationdb.order_tracking where is_active in (${isActive}) Limit 500`;
    } else {
      queryString = `select * from integrationdb.order_tracking where tech = '${userId}' and is_active in (${isActive}) Limit 500`;
    }

    const [rows, _fields] = await this.db.pool.promise().query(queryString);
    return [rows];
  }

  async getOrderById(orderId: number) {
    const [rows, _fields] = await this.db.pool
      .promise()
      .query('select * from `order_tracking` where order_number = ?', [
        orderId,
      ]);
    return [rows];
  }

  async uploadOrders(orderDetails: NewOrderDto) {
    let queryString: string;
    let queryArray: any[][] = [];

    orderDetails.orderNumbers.forEach((orderNumber: number) => {
      queryArray.push([
        orderNumber,
        orderDetails.tech,
        orderDetails.startTime,
        orderDetails.isActive,
        orderDetails.hasIssue,
      ]);
    });

    if (orderDetails.orderNumbers.length > 1) {
      queryString = `insert ignore into integrationdb.order_tracking (order_number, tech, start_time, is_active, has_issue) values ?`;
    } else {
      queryString = `insert into integrationdb.order_tracking (order_number, tech, start_time, is_active, has_issue) values ?`;
    }

    return await this.db.pool.promise().query(queryString, [queryArray]);
  }

  async updateOrder(updateDetails: EditOrderDto) {}

  async deleteOrderById(orderId: number) {}
}
