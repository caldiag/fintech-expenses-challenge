import { IsOptional, IsString } from 'class-validator';

export default class CreateTransactionCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  icon: string;
}
