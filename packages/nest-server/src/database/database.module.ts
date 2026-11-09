import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transaction/entity/transaction.entity.js';
import { UserEntity } from '../user/entity/user.entity.js';
import { CategoryEntity } from '../category/entity/category.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, UserEntity, CategoryEntity]),
  ],
})
export class DatabaseModule {}
