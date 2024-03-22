import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: number,
  ): Promise<void> {
    return this.userService.createUser(username, email, password, role);
  }

  @Get('username')
  @UseGuards(AuthGuard('jwt'))
  getUsername(@Req() req: any): Promise<string> {
    const id: number = req.user.id;
    return this.userService.getUsername(id);
  }
}
