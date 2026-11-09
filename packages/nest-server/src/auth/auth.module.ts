import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.ts';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.ts';
import { UserModule } from '../user/user.module.ts';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15d' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
