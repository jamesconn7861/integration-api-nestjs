import {
  Get,
  Post,
  Patch,
  Controller,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { DeleteOrderDto, EditOrderDto, NewOrderDto } from './dtos';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get(':user')
  getOrdersByUser(@Param('user') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Post('/upload')
  uploadOrders(@Body() newOrderDto: NewOrderDto) {
    return this.orderService.uploadOrders(newOrderDto);
  }

  @Patch('/edit')
  editOrder(@Body() editOrderDto: EditOrderDto) {
    return this.orderService.editOrder(editOrderDto);
  }

  @Delete('/delete')
  deleteOrders(@Body() deleteOrderDto: DeleteOrderDto) {
    return this.orderService.deleteOrders(deleteOrderDto);
  }
}
