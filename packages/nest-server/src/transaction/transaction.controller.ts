import { PermissionKey, PermissionScope } from '@app/types';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserContext } from '../auth/guard/context.decorator.ts';
import { PermissionsService } from '../permissions/permissions.service.ts';
import { UserService } from '../user/user.service.ts';
import CreateTransactionCategoryDTO from './dto/create-transaction-category.dto.ts';
import CreateTransactionDTO from './dto/create-transaction.dto.ts';
import GetTransactionsDTO from './dto/get-transactions.dto.ts';
import {
  TransactionCategoryResponseDTO,
  TransactionPageResponseDTO,
  TransactionResponseDTO,
} from './dto/transaction-response.dto.ts';
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
  ): Promise<TransactionResponseDTO> {
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

    return this.transactionService.createTransaction(
      transactionData,
      transactionCategoryId,
      roleId,
      companyId,
      userId,
    );
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() transaction: CreateTransactionDTO,
    @UserContext() userId: string,
  ): Promise<TransactionResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const existing = await this.transactionService.findTransactionById(id);
    if (!existing) throw new NotFoundException('Transaction not found');
    const scope = await this.permissionService.validateUserPermissionScope(
      userId,
      PermissionKey.TransactionUpdateScope,
    );
    if (
      !this.permissionService.canAccessTransaction(
        user,
        existing,
        PermissionKey.TransactionUpdateScope,
      )
    ) {
      throw new ForbiddenException('Cannot update this transaction');
    }
    if (
      scope === PermissionScope.ROLE &&
      user.role?.id !== transaction.roleId
    ) {
      throw new ForbiddenException(
        'Cannot assign this transaction to another role',
      );
    }
    return this.transactionService.updateTransaction(id, transaction);
  }

  @Delete(':id')
  async deleteTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @UserContext() userId: string,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    const transaction = await this.transactionService.findTransactionById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (
      !this.permissionService.canAccessTransaction(
        user,
        transaction,
        PermissionKey.TransactionDeleteScope,
      )
    ) {
      throw new ForbiddenException('Cannot delete this transaction');
    }
    await this.transactionService.deleteTransaction(id);
  }

  @Get('all')
  async getAllTransactions(
    @UserContext() userId: string,
    @Query() query: GetTransactionsDTO,
  ): Promise<TransactionPageResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');

    const readScope = await this.permissionService.validateUserPermissionScope(
      user.id,
      PermissionKey.TransactionReadScope,
    );

    const { page = 0, ...filters } = query;

    if (readScope === PermissionScope.ROLE) {
      if (!user.role) throw new BadRequestException('A role is required');
      filters.roleId = user.role.id;
    }

    if (readScope === PermissionScope.OWN) {
      //tried to filter from a user but they don't have access to other users' transactions
      filters.createdById = user.id;
    }

    return this.transactionService.findTransactions(filters, page);
  }

  @Post('category/create')
  async createTransactionCategory(
    @Body() transactionCategory: CreateTransactionCategoryDTO,
    @UserContext() userId: string,
  ): Promise<TransactionCategoryResponseDTO> {
    return this.transactionService.createTransactionCategory(
      transactionCategory,
      userId,
    );
  }

  @Get('category/all')
  async getAllTransactionCategories(): Promise<
    TransactionCategoryResponseDTO[]
  > {
    return this.transactionService.findAllTransactionCategories();
  }

  @Get('category/:id')
  async getTransactionCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionCategoryResponseDTO | null> {
    const category =
      await this.transactionService.findTransactionCategoryById(id);
    return category;
  }

  @Get(':id')
  async getTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @UserContext() userId: string,
  ): Promise<TransactionResponseDTO> {
    const user = await this.userService.getUserById(userId);
    const transaction = await this.transactionService.findTransactionById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');

    if (
      !this.permissionService.canAccessTransaction(
        user,
        transaction,
        PermissionKey.TransactionReadScope,
      )
    ) {
      throw new ForbiddenException('Cannot read this transaction');
    }
    return transaction;
  }
}
