import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { EditOrderDto, NewOrderDto } from './dtos';

@Injectable()
export class OrderTrackingService {
  constructor(private db: DbService) {}

  async getOrdersByUser(userId: string) {
    let queryString: string;

    if (userId === 'all') {
      queryString = `select * from integrationdb.order_tracking`;
    } else {
      queryString = `select * from integrationdb.order_tracking where tech = '${userId}'`;
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

  async uploadOrders(orderDetails: NewOrderDto[]) {
    let queryString: string;

    if (orderDetails.length > 1) {
      queryString = `insert ignore into integrationdb.order_tracking (order_number, tech, start_time, is_active, has_issue) values ?`;
    } else {
      queryString = `insert into integrationdb.order_tracking (order_number, tech, start_time, is_active, has_issue) values ?`;
    }

    return await this.db.pool.promise().query(queryString, [orderDetails]);
  }

  async updateOrder(updateDetails: EditOrderDto) {}

  async deleteOrderById(orderId: number) {}
}
