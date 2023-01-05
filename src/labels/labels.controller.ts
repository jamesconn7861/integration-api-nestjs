import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LabelData } from './dtos';

import { LabelsService } from './labels.service';

@Controller('labels')
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Get(':table/:user')
  getByUserAndTable(
    @Param('table') tableId: string,
    @Param('user') userId: string,
  ) {
    return this.labelsService.getByUserAndTable(tableId, userId);
  }

  @Post('upload')
  uploadLabels(@Body() labelData: LabelData) {
    return this.labelsService.uploadLabels(labelData);
  }
}
