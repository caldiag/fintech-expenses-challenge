import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { AccountCredentialsDTO as AccountCredentialsDTO } from './dto/account-credentials.dto.ts';
import { Public } from './guard/public.decorator.ts';
import { CreateUserDTO } from '../user/dto/user.dto.ts';
import type { Response } from 'express';
import { UserContext } from './guard/context.decorator.ts';
import { UserService } from '../user/user.service.ts';

@Controller('login')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Public()
  async login(
    @Body() credentials: AccountCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateLoginOrFail(credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.authService.generateToken(user);
    res.cookie('authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  @Post('register')
  @Public()
  async register(
    @Body() user: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { firstName, lastName, email } = user;
    const createdUser = await this.authService.registerUser(user);

    if (!createdUser)
      throw new InternalServerErrorException('Something went wrong.');

    const token = this.authService.generateToken({
      firstName,
      lastName,
      email,
      id: createdUser.id,
    });

    res.cookie('authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'User registered successfully',
    };
  }

  @Get('me')
  async me(
    @Req() req: Request & { headers: any },
    @UserContext() userId: string | null,
  ) {
    if (!userId) throw new BadRequestException();
    return await this.userService.getUserById(userId);
  }
}
