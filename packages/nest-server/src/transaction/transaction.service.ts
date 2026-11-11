import { Currency } from '@app/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Like, Repository } from 'typeorm';
import { TransactionCategoryEntity } from './entities/transaction-category.entity.ts';
import { TransactionEntity } from './entities/transaction.entity.ts';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionCategoryEntity)
    private readonly transactionCategoryReporitory: Repository<TransactionCategoryEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(
    transaction: Omit<TransactionEntity, 'id'>,
  ): Promise<TransactionEntity | null> {
    await this.transactionRepository.save(transaction);
    return null;
  }
  async findTransactions(
    filters: FindTransactionFilters,
    page: number,
    limit?: number,
  ): Promise<TransactionEntity[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .limit(limit ?? 1000)
      .offset(page * (limit ?? 0))
      .where({
        name: Like(filters.name),
        description: Like(filters.description),
        transactionCategory: { id: filters.transactionCategoryId },
        createdBy: { id: filters.createdById },
        createdAt: Between(filters.fromDate, filters.toDate),
        amount: filters.amount,
        amountCents: filters.amount,
        currency: filters.currency,
        role: { id: filters.roleId },
      });
    return await queryBuilder.getMany();
  }
}

type FindTransactionFilters = {
  name?: string;
  description?: string;
  transactionCategoryId?: string;
  createdById?: string;
  fromDate?: Date;
  toDate?: Date;
  amount?: number;
  amountCents?: number;
  currency?: Currency;
  roleId?: string;
};
