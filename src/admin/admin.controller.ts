import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { UpdateBenchDto, UpdateVlanDto } from './dtos';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/update-vlans')
  updateVlan(@Body() updateVlanDto: UpdateVlanDto) {
    return this.adminService.updateVlan(updateVlanDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/update-benches')
  updateBench(@Body() updateBenchDto: UpdateBenchDto) {
    return this.adminService.updateBench(updateBenchDto);
  }
}
