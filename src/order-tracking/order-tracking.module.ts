import { Module } from '@nestjs/common';
import { OrderTrackingController } from './order-tracking.controller';
import { OrderTrackingService } from './order-tracking.service';

@Module({
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService],
})
export class OrderTrackingModule {}
