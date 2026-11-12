import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { AuthModule } from './auth/auth.module.ts';
import { TransactionModule } from './transaction/transaction.module.ts';
import { UserModule } from './user/user.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module.ts';
import { PermissionsModule } from './permissions/permissions.module.ts';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './typeorm/datasource.ts';
import { ContactModule } from './contact/contact.module.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard.ts';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    AuthModule,
    TransactionModule,
    UserModule,
    ContactModule,
    CompanyModule,
    PermissionsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
