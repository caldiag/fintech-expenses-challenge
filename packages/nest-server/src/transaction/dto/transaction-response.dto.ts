import { Currency, TransactionDirection } from '@app/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleResponseDTO } from '../../permissions/dto/role-response.dto.ts';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';
import { UserResponseDTO } from '../../user/dto/user-response.dto.ts';

export class TransactionCategoryResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserResponseDTO)
  createdBy?: UserResponseDTO | null;
}

export class TransactionCompanyResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  areaCode?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;
}

export class TransactionResponseDTO extends BaseResponseDTO {
  @IsNumber()
  amount: number;

  @IsNumber()
  amountCents: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsString()
  description: string;

  @IsEnum(TransactionDirection)
  transactionDirection: TransactionDirection;

  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionCategoryResponseDTO)
  transactionCategory?: TransactionCategoryResponseDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoleResponseDTO)
  role?: RoleResponseDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionCompanyResponseDTO)
  company?: TransactionCompanyResponseDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserResponseDTO)
  createdBy?: UserResponseDTO | null;
}

export class TransactionPageResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionResponseDTO)
  transactions: TransactionResponseDTO[];

  @IsInt()
  total: number;

  @IsInt()
  totalPages: number;
}
