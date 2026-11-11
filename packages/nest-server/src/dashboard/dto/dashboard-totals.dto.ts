import { IsNumber, Max } from 'class-validator';

export class DashboardTotalsDTO {
  @IsNumber()
  totalInbound: number;

  @IsNumber()
  @Max(99)
  totalOutbound: number;
}
