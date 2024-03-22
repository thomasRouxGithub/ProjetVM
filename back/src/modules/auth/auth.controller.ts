import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken } = await this.authService.login(email, password);
    try {
      res.cookie('accessToken', accessToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
