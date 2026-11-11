import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export default class CreateContactDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  companyIds?: string[];
}
