import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity.ts';
import { TransactionCategoryEntity } from './entities/transaction-category.entity.ts';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionCategoryEntity)
    private readonly transactionCategoryReporitory: Repository<TransactionCategoryEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(): Promise<TransactionEntity | null> {
    return null;
  }
}
