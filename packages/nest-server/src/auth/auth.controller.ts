import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { AccountCredentialsDTO as AccountCredentialsDTO } from './dto/AccountCredentials.dto.ts';
import { Public } from './guard/public.decorator.ts';
import { CreateUserDTO } from '../user/dto/User.dto.ts';

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  async login(
    @Body() credentials: AccountCredentialsDTO,
  ): Promise<{ token: string }> {
    const user = await this.authService.validateLoginOrFail(credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { token: this.authService.generateToken(user) };
  }

  @Post('/register')
  @Public()
  async register(
    @Body() user: CreateUserDTO,
  ): Promise<{ message: string; token: string }> {
    const { firstName, lastName, email } = user;
    const createdUser = await this.authService.registerUser(user);

    if (!createdUser)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: 'User registered successfully',
      token: this.authService.generateToken({
        firstName,
        lastName,
        email,
        id: createdUser.id,
      }),
    };
  }
}
