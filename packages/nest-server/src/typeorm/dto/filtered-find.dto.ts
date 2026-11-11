import { SortDirection } from '@app/types';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export default class FilteredFindDTO {
  @IsUUID('4')
  @IsOptional()
  createdById?: string;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  orderDirection?: SortDirection;
}
