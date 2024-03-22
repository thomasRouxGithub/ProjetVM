import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserPassword(password: string): Promise<boolean> {
    return this.userRepository.findOne({ where: { password } }) ? true : false;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async getUsername(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.username;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    role: number,
  ): Promise<void> {
    const newUser = {
      username: username,
      email: email,
      password: password,
      role: role,
    };

    await this.userRepository.save(newUser);
  }
}
