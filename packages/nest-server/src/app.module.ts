import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoryModule } from './category/category.module.js';
import { TransactionModule } from './transaction/transaction.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { UserModule } from './user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module.js';
import { CompanyModule } from './company/company.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RoleModule } from './role/role.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    CategoryModule,
    TransactionModule,
    DashboardModule,
    UserModule,
    ConfigModule,
    CompanyModule,
    RoleModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
