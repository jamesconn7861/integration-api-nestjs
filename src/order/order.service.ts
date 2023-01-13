import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { DeleteOrderDto, EditOrderDto, NewOrderDto } from './dtos';

@Injectable()
export class OrderService {
  constructor(private db: DbService) {}

  async getOrdersByUser(userId: string) {
    const [rows, _fields] = await this.db.pool
      .promise()
      .query('select * from `order_tracking` where `tech` = ?', [userId]);
    return [rows];
  }

  async uploadOrders(newOrderDto: NewOrderDto) {
    let orderArray = [];

    newOrderDto.orders.forEach((order) => {
      orderArray.push([order, newOrderDto.tech, newOrderDto.startTime, 1, 0]);
    });

    const insertResult = await this.db.pool
      .promise()
      .query(
        'insert ignore into `order_tracking` (order_number, tech, start_time, is_active, has_issue) values ?',
        [orderArray],
      );
    return insertResult;
  }

  async editOrder(editOrderDto: EditOrderDto) {
    let fieldValueStrings = [];

    let filteredDto = Object.fromEntries(
      Object.entries(editOrderDto).filter(([_, v]) => v != null),
    );

    delete filteredDto.order_number;

    Object.keys(filteredDto).forEach((objectKey) => {
      fieldValueStrings.push(`${objectKey} = '${filteredDto[objectKey]}'`);
    });

    let fieldValueString = fieldValueStrings.join(', ');
    let queryString = `update integrationdb.order_tracking set ${fieldValueString} where order_number = '${editOrderDto.order_number}'`;

    const editResult = await this.db.pool.promise().query(queryString);
    return editResult;
  }

  async deleteOrders(deleteOrderDto: DeleteOrderDto) {
    const deleteResult = await this.db.pool
      .promise()
      .query('delete from `order_tracking` where `order_number` in (?)', [
        deleteOrderDto.orderNumbers,
      ]);
    return deleteResult;
  }
}
