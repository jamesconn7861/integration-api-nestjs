import { Module } from '@nestjs/common';
import { CachedService } from './cached.service';
import { CachedController } from './cached.controller';

@Module({
  providers: [CachedService],
  controllers: [CachedController],
  exports: [CachedService],
})
export class CachedModule {}
