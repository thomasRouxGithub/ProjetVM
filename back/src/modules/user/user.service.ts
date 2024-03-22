// import { ComputeManagementClient } from '@azure/arm-compute';
// import { NetworkManagementClient } from '@azure/arm-network';
// import { ResourceManagementClient } from '@azure/arm-resources';
// import { StorageManagementClient } from '@azure/arm-storage';
// import { DefaultAzureCredential } from '@azure/identity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { util } from 'util';

import { User } from '../../models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string): Promise<void> {
    const newUser = {
      username: username,
    };

    await this.userRepository.save(newUser);
  }
}
