import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export default class FilteredFindDTO {
  @IsUUID('4')
  @IsOptional()
  createdById?: string;

  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @IsDate()
  @IsOptional()
  toDate?: Date;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  orderDirection?: OrderDirection;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
