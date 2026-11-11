import { Currency } from '@app/types';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import FilteredFindDTO from '../../typeorm/dto/filtered-find.dto.ts';

export enum TransactionOrderBy {
  Amount = 'amount',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Currency = 'currency',
}

export default class GetTransactionsDTO extends FilteredFindDTO {
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  amount?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  amountCents?: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsUUID('4')
  @IsOptional()
  categoryId?: string;

  @IsUUID('4')
  @IsOptional()
  roleId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  transactionCategoryId?: string;

  @IsEnum(TransactionOrderBy)
  @IsOptional()
  declare orderBy?: TransactionOrderBy;

  @IsUUID('4')
  @IsOptional()
  companyId?: string;
}
