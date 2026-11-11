import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export default class GetCompaniesDTO {
  @IsOptional()
  @IsUUID('4')
  createdById?: string;

  @IsOptional()
  @IsUUID('4')
  createdByRoleId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  areaCode?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
