import { PermissionScope } from '@app/types';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';

export class PermissionSetResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsEnum(PermissionScope)
  transactionCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  transactionReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  transactionUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  transactionDeleteScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  companyCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  companyReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  companyUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  companyDeleteScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  contactCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  contactReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  contactUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  contactDeleteScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  categoryCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  categoryReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  categoryUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  categoryDeleteScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  userCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  userReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  userUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  userDeleteScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  roleCreateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  roleReadScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  roleUpdateScope?: PermissionScope;

  @IsOptional()
  @IsEnum(PermissionScope)
  roleDeleteScope?: PermissionScope;
}
