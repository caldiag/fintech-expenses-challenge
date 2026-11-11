import { PermissionKey, PermissionScope } from '@app/types';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { PermissionsService } from '../permissions/permissions.service.ts';
import { UserService } from '../user/user.service.ts';
import CreateTransactionCategoryDTO from './dto/create-transaction-category.dto.ts';
import CreateTransactionDTO from './dto/create-transaction.dto.ts';
import GetTransactionsDTO from './dto/get-transactions.dto.ts';
import { TransactionCategoryEntity } from './entities/transaction-category.entity.ts';
import { TransactionEntity } from './entities/transaction.entity.ts';
import { TransactionService } from './transaction.service.ts';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionsService,
  ) {}

  @Post('create')
  async createTransaction(
    @Body() transaction: CreateTransactionDTO,
    @UserContext() userId: string,
  ): Promise<TransactionEntity> {
    const { roleId, transactionCategoryId, companyId, ...transactionData } =
      transaction;
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');

    const createScope =
      await this.permissionService.validateUserPermissionScope(
        userId,
        PermissionKey.TransactionCreateScope,
      );
    if (createScope !== PermissionScope.ALL && user.role?.id !== roleId) {
      throw new ForbiddenException('Cannot create a transaction for this role');
    }

    return await this.transactionService.createTransaction(
      transactionData,
      transactionCategoryId,
      roleId,
      companyId,
      userId,
    );
  }

  @Get('all')
  async getAllTransactions(
    @UserContext() userId: string,
    @Query() query: GetTransactionsDTO,
    @Query('page') pageParam?: string,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');

    const readScope = await this.permissionService.validateUserPermissionScope(
      user.id,
      PermissionKey.TransactionReadScope,
    );

    const filters = { ...query };

    if (filters.roleId && readScope === PermissionScope.ROLE) {
      //force filtering by their role if they can't access a different role
      filters.roleId = user.role.id;
    }

    if (readScope === PermissionScope.OWN) {
      //tried to filter from a user but they don't have access to other users' transactions
      filters.createdById = user.id;
    }

    const page = Number(pageParam ?? 0);
    if (!Number.isInteger(page) || page < 0) {
      throw new BadRequestException('Page must be a non-negative integer');
    }

    return await this.transactionService.findTransactions(filters, page);
  }

  @Post('category/create')
  async createTransactionCategory(
    @Body() transactionCategory: CreateTransactionCategoryDTO,
    @UserContext() userId: string,
  ) {
    return await this.transactionService.createTransactionCategory(
      transactionCategory,
      userId,
    );
  }

  @Get('category/all')
  async getAllTransactionCategories(): Promise<TransactionCategoryEntity[]> {
    return await this.transactionService.findAllTransactionCategories();
  }

  @Get('category/:id')
  async getTransactionCategory(
    @Param() id: string,
  ): Promise<TransactionCategoryEntity | null> {
    return await this.transactionService.findTransactionCategoryById(id);
  }
}
