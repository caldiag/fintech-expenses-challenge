import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from './utils/password-utils.ts';
import { UserService } from '../user/user.service.ts';
import { AccountCredentialsDTO } from './dto/AccountCredentials.dto.ts';
import { UserEntity } from '../user/entities/user.entity.ts';
import { CreateUserDTO } from '../user/dto/User.dto.ts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private UserService: UserService,
  ) {}

  generateToken(
    user: Omit<CreateUserDTO, 'password'> & { id: string },
  ): string {
    const { id, firstName, lastName, email } = user;
    return this.jwtService.sign({ id, firstName, lastName, email });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  async validateLoginOrFail(
    loginInfo: AccountCredentialsDTO,
  ): Promise<UserEntity> {
    const { email, password } = loginInfo;
    const user = await this.UserService.getUserByEmail(email);

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async registerUser(user: CreateUserDTO): Promise<UserEntity> {
    return await this.UserService.createUser(user);
  }
}
