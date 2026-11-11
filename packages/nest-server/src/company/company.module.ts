import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module.ts';
import { UserModule } from '../user/user.module.ts';
import { CompanyController } from './company.controller.ts';
import { CompanyService } from './company.service.ts';
import { CompanyEntity } from './entities/company.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    UserModule,
    PermissionsModule,
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
