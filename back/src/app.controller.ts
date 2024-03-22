import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('azureStart')
  getAzureStart(): Promise<string> {
    return this.appService.getAzure();
  }

  @Get('azureDelete')
  getAzureDelete(): Promise<string> {
    return this.appService.getAzure();
  }
}
