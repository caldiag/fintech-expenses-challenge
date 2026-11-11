import { Currency, TransactionDirection } from '@app/types';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export default class CreateTransactionDTO {
  @IsString()
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  amount: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  amountCents: number;

  @IsString()
  currency: Currency;

  @IsEnum(TransactionDirection)
  transactionDirection: TransactionDirection;

  @IsString()
  transactionCategoryId: string;

  @IsString()
  roleId: string;

  @IsString()
  companyId: string;
}
