import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity.js';

@Module({
  imports: [],
  exports: [TransactionEntity],
})
export class TransactionModule {}
