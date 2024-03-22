import { Injectable } from '@nestjs/common';

import { AzureService } from './utils/azure.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getAzure(): Promise<string> {
    const test: string = await AzureService.startAzure();
    return `Get Azure ! ${test}`;
  }
}
