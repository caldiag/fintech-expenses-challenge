import { IsNumber, IsString } from 'class-validator';

export class DashboardTopCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsNumber()
  totalAmount: number;
}
