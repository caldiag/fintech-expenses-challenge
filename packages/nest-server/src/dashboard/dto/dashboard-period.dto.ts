import { IsDateString, IsNumber } from 'class-validator';

export class DashboardPeriodDTO {
  @IsDateString()
  date: string;

  @IsNumber()
  totalInbound: number;

  @IsNumber()
  totalOutbound: number;
}
