import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('/:user')
  getUser(@Param('user') userId: string) {
    return this.usersService.getUser(userId);
  }
}
