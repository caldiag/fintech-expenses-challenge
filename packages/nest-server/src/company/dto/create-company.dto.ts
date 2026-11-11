import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export default class CreateCompanyDTO {
  @IsString()
  name: string;

  @IsString()
  websiteUrl: string;

  @IsOptional()
  @IsString()
  areaCode?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  contactIds?: string[];
}
