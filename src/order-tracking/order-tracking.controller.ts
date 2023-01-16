import { Body, Controller, Param } from '@nestjs/common';
import { Delete, Get, Patch, Post } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { EditOrderDto, NewOrderDto } from './dtos';
import { OrderTrackingService } from './order-tracking.service';

@Controller('order-tracking')
export class OrderTrackingController {
  constructor(private otService: OrderTrackingService) {}

  @Get('/user/:userId')
  getOrdersByUser(@Param('userId') userId: string) {
    return this.otService.getOrdersByUser(userId);
  }

  @Get('/order/:orderId')
  getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.otService.getOrderById(orderId);
  }

  @Post('/upload')
  uploadOrders(@Body() orderDetails: NewOrderDto[]) {
    return this.otService.uploadOrders(orderDetails);
  }

  @Patch('/update')
  updateOrder(@Body() updateDetails: EditOrderDto) {
    return this.otService.updateOrder(updateDetails);
  }

  @Delete('/delete/:orderId')
  deleteOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.otService.deleteOrderById(orderId);
  }
}
