import { Currency, TransactionDirection } from '@app/types';
import { IsEnum, IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export default class CreateTransactionDTO {
  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  @Max(2147483647)
  amount: number;

  @IsInt()
  @Min(0)
  @Max(99)
  amountCents: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(TransactionDirection)
  transactionDirection: TransactionDirection;

  @IsUUID('4')
  transactionCategoryId: string;

  @IsUUID('4')
  roleId: string;

  @IsUUID('4')
  companyId: string;
}
