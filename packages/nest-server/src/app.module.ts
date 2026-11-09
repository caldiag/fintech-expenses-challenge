import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { AuthModule } from './auth/auth.module.ts';
import { CategoryModule } from './category/category.module.ts';
import { TransactionModule } from './transaction/transaction.module.ts';
import { DashboardModule } from './dashboard/dashboard.module.ts';
import { UserModule } from './user/user.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module.ts';
import { RoleModule } from './role/role.module.ts';
import { PermissionsModule } from './permissions/permissions.module.ts';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './typeorm/datasource.ts';
import { ContactModule } from './contact/contact.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    CategoryModule,
    TransactionModule,
    DashboardModule,
    UserModule,
    ContactModule,
    CompanyModule,
    RoleModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
