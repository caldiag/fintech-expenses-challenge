import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transaction/entities/transaction.entity.ts';
import { UserEntity } from '../user/entities/user.entity.ts';
import { CategoryEntity } from '../category/entities/category.entity.ts';
import { PermissionSetEntity } from '../permissions/entities/permission-set.entity.ts';
import { RoleEntity } from '../role/entities/role.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      UserEntity,
      CategoryEntity,
      PermissionSetEntity,
      RoleEntity,
    ]),
  ],
})
export class DatabaseModule {}
