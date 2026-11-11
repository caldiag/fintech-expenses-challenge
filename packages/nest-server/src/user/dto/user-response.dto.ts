import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';
import { PermissionSetResponseDTO } from '../../permissions/dto/permission-set-response.dto.ts';
import { RoleResponseDTO } from '../../permissions/dto/role-response.dto.ts';

export class UserResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoleResponseDTO)
  role?: RoleResponseDTO | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionSetResponseDTO)
  permissionSet?: PermissionSetResponseDTO | null;
}
