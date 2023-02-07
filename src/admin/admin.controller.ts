import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import {
  CreateBenchDto,
  CreateVlanDto,
  UpdateBenchDto,
  UpdateVlanDto,
} from './dtos';

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

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/create-vlan')
  createVlan(@Body() createVlanDto: CreateVlanDto) {
    return this.adminService.createVlan(createVlanDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/create-bench')
  createBench(@Body() createBenchDto: CreateBenchDto) {
    return this.adminService.createBench(createBenchDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Delete('/delete-bench/:vlanId')
  deleteVlan(@Param('vlanId') vlanId: string) {
    return this.adminService.deleteVlan(vlanId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/delete-bench/:benchId')
  deleteBench(@Param('benchId') benchId: string) {
    return this.adminService.deleteBench(benchId);
  }
}
