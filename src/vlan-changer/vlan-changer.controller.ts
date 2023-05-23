import { Get, Post, Controller, Param, Body, Logger } from '@nestjs/common';
import { SetVlansDto } from './dtos';
import { VlanChangerService } from './vlan-changer.service';

@Controller('vlan-changer')
export class VlanChangerController {
  constructor(private vlanChangerService: VlanChangerService) {}

  @Get(':benchId')
  getPortsByBench(@Param('benchId') benchId: string) {
    return this.vlanChangerService.getPortsByBench(benchId);
  }

  @Post('/change')
  setVlans(@Body() setVlansDto: SetVlansDto) {
    return this.vlanChangerService.setVlans(setVlansDto);
  }
}
