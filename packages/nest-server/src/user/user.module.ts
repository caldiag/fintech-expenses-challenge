import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity.ts';

@Module({ providers: [UserEntity] })
export class UserModule {}
