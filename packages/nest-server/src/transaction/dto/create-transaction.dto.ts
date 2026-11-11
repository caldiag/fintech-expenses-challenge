import { Currency, TransactionDirection } from '@app/types';
import { IsEnum, IsNumber, IsString, IsUUID, Max } from 'class-validator';

export default class CreateTransactionDTO {
  @IsString()
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Max(2147483647)
  amount: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
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
