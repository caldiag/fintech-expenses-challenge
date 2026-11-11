import { SortDirection } from '@app/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import CreateTransactionCategoryDTO from './dto/create-transaction-category.dto.ts';
import CreateTransactionDTO from './dto/create-transaction.dto.ts';
import GetTransactionsDTO, {
  TransactionOrderBy,
} from './dto/get-transactions.dto.ts';
import { TransactionCategoryEntity } from './entities/transaction-category.entity.ts';
import { TransactionEntity } from './entities/transaction.entity.ts';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionCategoryEntity)
    private readonly transactionCategoryReporitory: Repository<TransactionCategoryEntity>,
  ) {}

  async createTransaction(
    transaction: Omit<
      CreateTransactionDTO,
      'id' | 'roleId' | 'transactionCategoryId' | 'companyId'
    >,
    transactionCategoryId: string,
    roleId: string,
    companyId: string,
    createdByUserId: string,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.save({
      ...transaction,
      transactionCategory: { id: transactionCategoryId },
      role: { id: roleId },
      company: { id: companyId },
      createdBy: { id: createdByUserId },
    });
  }

  async createTransactionCategory(
    transactionCategory: CreateTransactionCategoryDTO,
    createdByUserId: string,
  ): Promise<TransactionCategoryEntity> {
    return await this.transactionCategoryReporitory.save({
      ...transactionCategory,
      createdBy: { id: createdByUserId },
    });
  }

  async findTransactionCategoryById(
    id: string,
  ): Promise<TransactionCategoryEntity | null> {
    return await this.transactionCategoryReporitory.findOne({ where: { id } });
  }
  async findAllTransactionCategories(): Promise<TransactionCategoryEntity[]> {
    return await this.transactionCategoryReporitory.find();
  }

  async findTransactions(
    filters: GetTransactionsDTO,
    page: number,
    limit?: number,
    orderBy: TransactionOrderBy = TransactionOrderBy.CreatedAt,
    orderDirection: SortDirection = SortDirection.DESC,
  ): Promise<TransactionEntity[]> {
    const pageSize = limit ?? 1000;
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .take(pageSize)
      .skip(page * pageSize)
      .orderBy(TRANSACTION_ORDER_COLUMNS[orderBy], orderDirection);

    if (orderBy === 'amount') {
      queryBuilder.addOrderBy('transaction.amountCents', orderDirection);
    }

    queryBuilder.addOrderBy('transaction.id', orderDirection).where({
      description: filters.description ? Like(filters.description) : undefined,
      transactionCategory: { id: filters.transactionCategoryId },
      createdBy: { id: filters.createdById },
      createdAt:
        filters.fromDate && filters.toDate
          ? Between(filters.fromDate, filters.toDate)
          : undefined,
      amount: filters.amount,
      amountCents: filters.amountCents,
      currency: filters.currency,
      company: { id: filters.companyId },
      role: { id: filters.roleId },
    });
    return await queryBuilder.getMany();
  }
}

const TRANSACTION_ORDER_COLUMNS: Record<TransactionOrderBy, string> = {
  amount: 'transaction.amount',
  createdAt: 'transaction.createdAt',
  updatedAt: 'transaction.updatedAt',
  currency: 'transaction.currency',
};
