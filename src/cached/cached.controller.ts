import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { CachedService } from './cached.service';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UpdateBody } from './dtos';

@Controller('cached')
export class CachedController {
  constructor(private cachedService: CachedService) {}

  @Get('app-data')
  getAppInitData() {
    return this.cachedService.getAppInitData();
  }

  @Post('update-app-data')
  updateAppData(@Body() updateBody: UpdateBody) {
    if (updateBody.pass != 'upd@t3') {
      throw new ForbiddenException('Incorrect passcode.');
    }
    this.cachedService.updateCachedData();
    return { message: 'Update Complete.' };
  }
}
