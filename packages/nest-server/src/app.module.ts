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
import { DatabaseModule } from './database/database.module.ts';
import { RoleModule } from './role/role.module.ts';
import { PermissionsModule } from './permissions/permissions.module.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: true,
      synchronize: (process.env.NODE_ENV || '').toLowerCase() !== 'production',
    }),
    AuthModule,
    CategoryModule,
    TransactionModule,
    DashboardModule,
    UserModule,
    CompanyModule,
    RoleModule,
    DatabaseModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
