import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../typeorm/datasource.ts';
import { SeedAdmin } from './db-seed/seed-admin.command.ts';
import { PermissionsModule } from '../permissions/permissions.module.ts';
import { UserModule } from '../user/user.module.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    PermissionsModule,
    UserModule,
  ],
  providers: [SeedAdmin],
})
export class CommandModule {}
