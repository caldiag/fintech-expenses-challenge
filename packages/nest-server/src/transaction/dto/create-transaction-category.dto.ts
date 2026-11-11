import { IsString } from 'class-validator';

export default class CreateTransactionCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  icon: string;
}
