import { Module } from '@nestjs/common';
import { CachedModule } from 'src/cached/cached.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [CachedModule],
})
export class AdminModule {}
