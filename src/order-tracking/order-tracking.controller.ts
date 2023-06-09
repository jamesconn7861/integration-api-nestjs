import {
  Get,
  Patch,
  Post,
  Body,
  Controller,
  Param,
  UseFilters,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { DuplicateOrderFilter } from '../order-tracking/exception-filters/duplicate.exception';
import { EditOrderDto, NewOrderDto } from './dtos';
import { DeleteOrderDto } from './dtos/delete-order.dto';
import { OrderTrackingService } from './order-tracking.service';

@Controller('order-tracking')
export class OrderTrackingController {
  constructor(private otService: OrderTrackingService) {}

  @Get('/user/:userId')
  getOrdersByUser(@Param('userId') userId: string) {
    return this.otService.getOrdersByUser(userId, [1, 2, 3]);
  }

  @Get('/user/:userId/active')
  getActiveOrdersByUser(@Param('userId') userId: string) {
    return this.otService.getOrdersByUser(userId, [2]);
  }

  @Get('/user/:userId/closed')
  getClosedOrdersByUser(@Param('userId') userId: string) {
    return this.otService.getOrdersByUser(userId, [1]);
  }

  @Get('/user/:userId/error')
  getErrorOrdersByUser(@Param('userId') userId: string) {
    return this.otService.getOrdersByUser(userId, [3]);
  }

  @Get('/order/:orderId')
  getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.otService.getOrderById(orderId);
  }

  @Post('/upload')
  @UseFilters(DuplicateOrderFilter)
  uploadOrders(@Body() orderDetails: NewOrderDto) {
    return this.otService.uploadOrders(orderDetails);
  }

  @Patch('/update')
  updateOrder(@Body() updateDetails: EditOrderDto) {
    return this.otService.updateOrder(updateDetails);
  }

  @Post('/delete')
  deleteOrderById(@Body() deleteOrderDto: DeleteOrderDto) {
    return this.otService.deleteOrderById(deleteOrderDto);
  }
}
