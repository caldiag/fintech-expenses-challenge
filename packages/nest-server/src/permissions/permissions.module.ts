import { Module } from '@nestjs/common';
import { PermissionSetEntity } from './entities/permission-set.entity.ts';
import { PermissionsService } from './permissions.service.ts';
import { RoleEntity } from './entities/role.entity.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionSetEntity]),
    UserModule,
  ],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
