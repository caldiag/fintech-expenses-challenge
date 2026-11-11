import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';
import { UserResponseDTO } from '../../user/dto/user-response.dto.ts';

export class ContactCompanyResponseDTO extends BaseResponseDTO {
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

export class ContactResponseDTO extends BaseResponseDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactCompanyResponseDTO)
  companies?: ContactCompanyResponseDTO[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UserResponseDTO)
  createdBy?: UserResponseDTO | null;
}

export class ContactPageResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactResponseDTO)
  contacts: ContactResponseDTO[];

  @IsNumber()
  total: number;

  @IsNumber()
  totalPages: number;
}
