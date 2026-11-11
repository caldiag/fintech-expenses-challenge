import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module.ts';
import { DashboardController } from './dashboard.controller.ts';

@Module({
  imports: [TransactionModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
