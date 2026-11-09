import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transaction/entities/transaction.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { CategoryEntity } from '../category/entities/category.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, UserEntity, CategoryEntity]),
  ],
})
export class DatabaseModule {}
