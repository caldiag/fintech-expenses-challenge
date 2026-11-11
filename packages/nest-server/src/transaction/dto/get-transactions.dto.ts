import { Currency, TransactionDirection } from '@app/types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import FilteredFindDTO from '../../typeorm/dto/filtered-find.dto.ts';

export enum TransactionOrderBy {
  Amount = 'amount',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Currency = 'currency',
}

export default class GetTransactionsDTO extends FilteredFindDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  amount?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  amountCents?: number;

  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsOptional()
  amountGreaterThan?: string;

  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsOptional()
  amountLessThan?: string;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsEnum(TransactionDirection)
  @IsOptional()
  transactionDirection?: TransactionDirection;

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
