import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseResponseDTO } from '../../typeorm/dto/base-response.dto.ts';
import { PermissionSetResponseDTO } from './permission-set-response.dto.ts';

export class RoleResponseDTO extends BaseResponseDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionSetResponseDTO)
  permissionSet?: PermissionSetResponseDTO;
}
