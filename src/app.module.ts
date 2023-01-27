import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { LabelsModule } from './labels/labels.module';
import { ConfigModule } from '@nestjs/config';
import { CachedModule } from './cached/cached.module';
import { SshModule } from './ssh/ssh.module';
import { VlanChangerModule } from './vlan-changer/vlan-changer.module';
import { OrderTrackingModule } from './order-tracking/order-tracking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DbModule,
    LabelsModule,
    CachedModule,
    SshModule,
    VlanChangerModule,
    OrderTrackingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
