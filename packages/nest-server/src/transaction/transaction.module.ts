import { Module } from '@nestjs/common';
import { TransactionEntity } from './entities/transaction.entity.ts';

@Module({
  providers: [TransactionEntity],
})
export class TransactionModule {}
