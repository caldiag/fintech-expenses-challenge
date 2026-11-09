import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transaction/entity/transaction.entity.js';
import { UserEntity } from '../user/entity/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity])],
})
export class DatabaseModule {}
