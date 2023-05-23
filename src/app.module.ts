import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
// import { vlanLogger } from './middleware/logger/vlan-logger';

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
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(vlanLogger).forRoutes({path: 'vlan-changer', method: RequestMethod.POST})
  // }
}
