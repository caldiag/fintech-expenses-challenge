import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { hashPassword } from '../auth/utils/password-utils.ts';
import { CreateUserDTO } from './dto/user.dto.ts';
import { UserEntity } from './entities/user.entity.ts';

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
      relations: { role: true },
    });
  }
  async getUserById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneOrFail({
      where: { id },
      relations: { role: { permissionSet: true }, permissionSet: true },
    });
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

  async updateUser(
    userId: string,
    payload: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userRepository.save({ ...user, ...payload });
  }
}
