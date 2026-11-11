import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export default class GetContactsDTO {
  @IsOptional()
  @IsUUID('4')
  createdById?: string;

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
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID('4')
  companyId?: string;
}
