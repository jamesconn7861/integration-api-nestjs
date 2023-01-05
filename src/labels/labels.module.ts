import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';

@Module({
  imports: [DbModule],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
