import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserResponseDTO } from '../../user/dto/user-response.dto.ts';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';

export class CompanyContactResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;
}

export class CompanyResponseDTO extends BaseResponseDTO {
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
  @ValidateNested()
  @Type(() => UserResponseDTO)
  createdBy?: UserResponseDTO | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyContactResponseDTO)
  contacts?: CompanyContactResponseDTO[];
}

export class CompanyPageResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyResponseDTO)
  companies: CompanyResponseDTO[];

  @IsNumber()
  total: number;

  @IsNumber()
  totalPages: number;
}
