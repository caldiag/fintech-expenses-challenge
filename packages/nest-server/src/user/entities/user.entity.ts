import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity.ts';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.ts';
import { RoleEntity } from '../../role/entities/role.entity.ts';
import { PermissionSetEntity } from '../../permissions/entities/permission-set.entity.ts';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  passwordHash: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.createdBy)
  transactions: Relation<TransactionEntity[]>;

  @OneToMany(() => CategoryEntity, (category) => category.createdBy)
  categories: Relation<CategoryEntity[]>;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  role: Relation<RoleEntity>;

  @OneToOne(() => PermissionSetEntity, (permissionSet) => permissionSet.user)
  permissionSet: Relation<PermissionSetEntity> | null;
}
