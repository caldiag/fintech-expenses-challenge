import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module.ts';
import { UserModule } from '../user/user.module.ts';
import { TransactionCategoryEntity } from './entities/transaction-category.entity.ts';
import { TransactionEntity } from './entities/transaction.entity.ts';
import { TransactionController } from './transaction.controller.ts';
import { TransactionService } from './transaction.service.ts';

@Module({
  providers: [TransactionService],
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, TransactionCategoryEntity]),
    UserModule,
    PermissionsModule,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
