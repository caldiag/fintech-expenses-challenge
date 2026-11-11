import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import CreateTransactionCategoryDTO from './dto/create-transaction-category.dto.ts';
import CreateTransactionDTO from './dto/create-transaction.dto.ts';
import { TransactionEntity } from './entities/transaction.entity.ts';
import { TransactionService } from './transaction.service.ts';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(
    @Body() transaction: CreateTransactionDTO,
    @UserContext() userId: string | null,
  ): Promise<TransactionEntity> {
    if (!userId) {
      throw new ForbiddenException('User not found');
    }
    return await this.transactionService.createTransaction(
      transaction,
      transaction.transactionCategoryId,
      userId,
    );
  }

  @Post('category/create')
  async createTransactionCategory(
    @Body() transaction: CreateTransactionCategoryDTO,
    @UserContext() userId: string | null,
  ) {
    if (!userId) {
      throw new ForbiddenException('User not found');
    }
    return await this.transactionService.createTransactionCategory(
      transaction,
      userId,
    );
  }
}
