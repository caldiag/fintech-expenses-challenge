import { TransactionDirection } from '@app/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { DashboardPeriodDTO } from '../dashboard/dto/dashboard-period.dto.ts';
import { DashboardTopCategoryDTO } from '../dashboard/dto/dashboard-top-category.dto.ts';
import { DashboardTotalsDTO } from '../dashboard/dto/dashboard-totals.dto.ts';
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

  async findTransactionById(id: string): Promise<TransactionEntity | null> {
    return await this.transactionRepository.findOne({
      where: { id },
      relations: {
        transactionCategory: true,
        role: true,
        company: true,
        createdBy: { role: true },
      },
    });
  }

  async updateTransaction(
    id: string,
    transaction: CreateTransactionDTO,
  ): Promise<TransactionEntity> {
    const { transactionCategoryId, roleId, companyId, ...transactionData } =
      transaction;
    return await this.transactionRepository.save({
      id,
      ...transactionData,
      transactionCategory: { id: transactionCategoryId },
      role: { id: roleId },
      company: { id: companyId },
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionRepository.softDelete(id);
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
          createdAt: Between(
            new Date(filters.fromDate),
            new Date(filters.toDate),
          ),
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
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.transactionCategory', 'category')
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .leftJoinAndSelect('transaction.role', 'role')
      .leftJoinAndSelect('transaction.company', 'company')
      .where(where);

    if (filters.amountGreaterThan !== undefined) {
      query.andWhere(
        '(transaction.amount * 100 + transaction.amountCents) > :amountGreaterThan',
        {
          amountGreaterThan: Math.round(
            Number(filters.amountGreaterThan) * 100,
          ),
        },
      );
    }
    if (filters.amountLessThan !== undefined) {
      query.andWhere(
        '(transaction.amount * 100 + transaction.amountCents) < :amountLessThan',
        { amountLessThan: Math.round(Number(filters.amountLessThan) * 100) },
      );
    }

    const [transactions, total] = await query
      .orderBy('transaction.createdAt', 'DESC')
      .addOrderBy('transaction.id', 'DESC')
      .take(TRANSACTION_PAGE_SIZE)
      .skip(page * TRANSACTION_PAGE_SIZE)
      .getManyAndCount();
    return {
      transactions,
      total,
      totalPages: Math.ceil(total / TRANSACTION_PAGE_SIZE),
    };
  }

  async getTotals(): Promise<DashboardTotalsDTO> {
    const rows = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.transactionDirection', 'direction')
      .addSelect(
        'SUM(transaction.amount * 100 + transaction.amountCents)',
        'totalCents',
      )
      .groupBy('transaction.transactionDirection')
      .getRawMany<{
        direction: TransactionDirection;
        totalCents: string;
      }>();

    const totals = {
      totalInbound: 0,
      totalOutbound: 0,
    };

    for (const row of rows) {
      const total = Number(row.totalCents) / 100;
      if (row.direction === TransactionDirection.Inbound) {
        totals.totalInbound = total;
      } else {
        totals.totalOutbound = total;
      }
    }

    return totals;
  }

  async getHistorical(): Promise<DashboardPeriodDTO[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const rows = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt)', 'date')
      .addSelect('transaction.transactionDirection', 'direction')
      .addSelect(
        'SUM(transaction.amount * 100 + transaction.amountCents)',
        'totalCents',
      )
      .where('transaction.createdAt >= :startDate', { startDate })
      .andWhere('transaction.createdAt < :endDate', {
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      })
      .groupBy('DATE(transaction.createdAt)')
      .addGroupBy('transaction.transactionDirection')
      .getRawMany<{
        date: string | Date;
        direction: TransactionDirection;
        totalCents: string;
      }>();

    const totalsByDate = new Map<string, DashboardPeriodDTO>();
    for (
      let day = new Date(startDate);
      day <= today;
      day.setDate(day.getDate() + 1)
    ) {
      const date = formatDate(day);
      totalsByDate.set(date, { date, totalInbound: 0, totalOutbound: 0 });
    }

    for (const row of rows) {
      const date =
        row.date instanceof Date ? formatDate(row.date) : row.date.slice(0, 10);
      const dailyTotals = totalsByDate.get(date);
      if (!dailyTotals) continue;

      const total = Number(row.totalCents) / 100;
      if (row.direction === TransactionDirection.Inbound) {
        dailyTotals.totalInbound = total;
      } else {
        dailyTotals.totalOutbound = total;
      }
    }

    return [...totalsByDate.values()];
  }

  async getTopCategories(): Promise<DashboardTopCategoryDTO[]> {
    const rows = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.transactionCategory', 'category')
      .select('category.name', 'name')
      .addSelect('category.icon', 'icon')
      .addSelect(
        'SUM(transaction.amount * 100 + transaction.amountCents)',
        'totalCents',
      )
      .where('transaction.transactionDirection = :direction', {
        direction: TransactionDirection.Outbound,
      })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.icon')
      .orderBy(
        'SUM(transaction.amount * 100 + transaction.amountCents)',
        'DESC',
      )
      .addOrderBy('category.name', 'ASC')
      .limit(3)
      .getRawMany<{
        name: string;
        icon: string;
        totalCents: string;
      }>();

    return rows.map(({ name, icon, totalCents }) => ({
      name,
      icon,
      totalAmount: Number(totalCents) / 100,
    }));
  }
}

const TRANSACTION_PAGE_SIZE = 20;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
