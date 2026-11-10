import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { UserEntity } from './entities/user.entity.ts';
import { CreateUserDTO } from './dto/User.dto.ts';
import { hashPassword } from '../auth/utils/password-utils.ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserByEmail(
    email: string,
    includePasswordHash = false,
  ): Promise<UserEntity | null> {
    if (includePasswordHash)
      return await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.email = :email', { email })
        .getOne();
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  async getUserById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserDTO): Promise<UserEntity> {
    const { firstName, lastName, email, password } = user;
    if (await this.getUserByEmail(email)) {
      throw new Error('A user with this email already exists');
    }
    return await this.userRepository.save({
      firstName,
      lastName,
      email,
      passwordHash: await hashPassword(password),
    });
  }
}
