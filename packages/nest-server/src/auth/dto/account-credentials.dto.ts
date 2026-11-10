import { IsEmail, IsStrongPassword } from 'class-validator';

export class AccountCredentialsDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
