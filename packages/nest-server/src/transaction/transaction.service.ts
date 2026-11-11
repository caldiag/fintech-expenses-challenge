import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import CreateTransactionCategoryDTO from './dto/create-transaction-category.dto.ts';
import CreateTransactionDTO from './dto/create-transaction.dto.ts';
import GetTransactionsDTO from './dto/get-transactions.dto.ts';
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
  ): Promise<{
    transactions: TransactionEntity[];
    total: number;
    totalPages: number;
  }> {
    const where: FindOptionsWhere<TransactionEntity> = {
      ...(filters.description && { description: Like(filters.description) }),
      ...(filters.fromDate &&
        filters.toDate && {
          createdAt: Between(filters.fromDate, filters.toDate),
        }),
      ...(filters.amount !== undefined && { amount: filters.amount }),
      ...(filters.amountCents !== undefined && {
        amountCents: filters.amountCents,
      }),
      ...(filters.currency && { currency: filters.currency }),
      ...(filters.transactionDirection && {
        transactionDirection: filters.transactionDirection,
      }),
      ...(filters.transactionCategoryId && {
        transactionCategory: { id: filters.transactionCategoryId },
      }),
      ...(filters.createdById && { createdBy: { id: filters.createdById } }),
      ...(filters.companyId && { company: { id: filters.companyId } }),
      ...(filters.roleId && { role: { id: filters.roleId } }),
    };
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where,
        relations: {
          transactionCategory: true,
          createdBy: true,
          role: true,
          company: true,
        },
        order: { createdAt: 'DESC', id: 'DESC' },
        take: TRANSACTION_PAGE_SIZE,
        skip: page * TRANSACTION_PAGE_SIZE,
      },
    );
    return {
      transactions,
      total,
      totalPages: Math.ceil(total / TRANSACTION_PAGE_SIZE),
    };
  }
}

const TRANSACTION_PAGE_SIZE = 20;
