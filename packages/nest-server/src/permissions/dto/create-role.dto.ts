import { IsString } from 'class-validator';

export default class CreateRoleDTO {
  @IsString()
  name: string;

  @IsString()
  icon: string;
}
