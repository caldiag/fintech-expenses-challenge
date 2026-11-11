import { IsOptional, IsString } from 'class-validator';

export default class CreateTransactionCategoryDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  icon: string;
}
