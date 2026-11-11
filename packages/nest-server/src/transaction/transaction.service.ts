import { SortDirection } from '@app/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      .leftJoinAndSelect(
        'transaction.transactionCategory',
        'transactionCategory',
      )
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .leftJoin('transaction.company', 'company')
      .leftJoin('transaction.role', 'role')
      .take(pageSize)
      .skip(page * pageSize)
      .orderBy(TRANSACTION_ORDER_COLUMNS[orderBy], orderDirection);

    if (orderBy === 'amount') {
      queryBuilder.addOrderBy('transaction.amountCents', orderDirection);
    }

    queryBuilder.addOrderBy('transaction.id', orderDirection).where('1 = 1');

    if (filters.description) {
      queryBuilder.andWhere('transaction.description LIKE :description', {
        description: filters.description,
      });
    }
    if (filters.fromDate && filters.toDate) {
      queryBuilder.andWhere(
        'transaction.createdAt BETWEEN :fromDate AND :toDate',
        { fromDate: filters.fromDate, toDate: filters.toDate },
      );
    }
    if (filters.amount !== undefined) {
      queryBuilder.andWhere('transaction.amount = :amount', {
        amount: filters.amount,
      });
    }
    if (filters.amountCents !== undefined) {
      queryBuilder.andWhere('transaction.amountCents = :amountCents', {
        amountCents: filters.amountCents,
      });
    }
    if (filters.currency !== undefined) {
      queryBuilder.andWhere('transaction.currency = :currency', {
        currency: filters.currency,
      });
    }

    if (filters.transactionCategoryId) {
      queryBuilder.andWhere('transactionCategory.id = :transactionCategoryId', {
        transactionCategoryId: filters.transactionCategoryId,
      });
    }
    if (filters.createdById) {
      queryBuilder.andWhere('createdBy.id = :createdById', {
        createdById: filters.createdById,
      });
    }
    if (filters.companyId) {
      queryBuilder.andWhere('company.id = :companyId', {
        companyId: filters.companyId,
      });
    }
    if (filters.roleId) {
      queryBuilder.andWhere('role.id = :roleId', { roleId: filters.roleId });
    }

    return await queryBuilder.getMany();
  }
}

const TRANSACTION_ORDER_COLUMNS: Record<TransactionOrderBy, string> = {
  amount: 'transaction.amount',
  createdAt: 'transaction.createdAt',
  updatedAt: 'transaction.updatedAt',
  currency: 'transaction.currency',
};
