import { Controller, Get, Post } from '@nestjs/common';
import { Param, UseGuards } from '@nestjs/common/decorators';
import { CachedService } from './cached.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/auth/guard';

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
  @UseGuards(JwtGuard)
  @Get('update-app-data')
  async updateAppData() {
    this.cachedService.updateCachedData();
    return { message: 'Update Complete.' };
  }
}
