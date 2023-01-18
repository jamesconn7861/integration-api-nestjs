import { Controller, Get, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { CachedService } from './cached.service';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UpdateBody } from './dtos';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Controller('cached')
export class CachedController {
  constructor(
    private cachedService: CachedService,
    private config: ConfigService,
  ) {}

  @Get('app-data')
  getAppInitData() {
    return this.cachedService.getAppInitData();
  }

  @Get('bench-schema')
  getBenchSchema() {
    return this.cachedService.getBenchSchema();
  }

  @Get('bench-schema/:benchId')
  getBenchSchemaById(@Param('benchId') benchId: string) {
    return this.cachedService.getBenchSchemaById(benchId);
  }

  @Get('vlan-schema')
  getVlanSchema() {
    return this.cachedService.getVlanSchema();
  }

  @Get('vlan-schema/:vlanId')
  getVlanSchemaById(@Param('vlanId') vlanId: string) {
    return this.cachedService.getVlanSchemaById(vlanId);
  }

  // TODO Add actual authentication for routes. Possibly with JWT and passport.
  @Post('update-app-data')
  async updateAppData(@Body() updateBody: UpdateBody) {
    const validPass = await argon.verify(
      this.config.get('ADMIN_PASS'),
      updateBody.pass,
    );
    if (!validPass) {
      throw new ForbiddenException('Incorrect passcode.');
    }
    this.cachedService.updateCachedData();
    return { message: 'Update Complete.' };
  }
}
