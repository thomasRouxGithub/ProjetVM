import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body('username') username: string): Promise<void> {
    return this.userService.createUser(username);
  }
}
