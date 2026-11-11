import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service.ts';
import { DashboardPeriodDTO } from './dto/dashboard-period.dto.ts';
import { DashboardTopCategoryDTO } from './dto/dashboard-top-category.dto.ts';
import { DashboardTotalsDTO } from './dto/dashboard-totals.dto.ts';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('totals')
  async getTotals(): Promise<DashboardTotalsDTO> {
    return await this.transactionService.getTotals();
  }

  @Get('period')
  async getHistorical(): Promise<DashboardPeriodDTO[]> {
    return await this.transactionService.getHistorical();
  }

  @Get('top')
  async getTop(): Promise<DashboardTopCategoryDTO[]> {
    return await this.transactionService.getTopCategories();
  }
}
