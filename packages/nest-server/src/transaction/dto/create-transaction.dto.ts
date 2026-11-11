import { Currency } from '@app/types';
import { IsNumber, IsString } from 'class-validator';

export default class CreateTransactionDTO {
  @IsString()
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  amount: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  amountCents: number;

  @IsString()
  currency: Currency;

  @IsString()
  transactionCategoryId: string;
}
