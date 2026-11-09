import { IsString, IsUUID } from 'class-validator';
import { AccountCredentialsDTO } from '../../auth/dto/AccountCredentials.dto.ts';

export class CreateUserDTO extends AccountCredentialsDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
