import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.ts';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { PermissionSetEntity } from './permission-set.entity.ts';

@Entity()
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  icon: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: Relation<UserEntity[]>;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.role)
  transactions: Relation<TransactionEntity[]>;

  @OneToOne(() => PermissionSetEntity, (permissionSet) => permissionSet.role, {
    nullable: false,
  })
  permissionSet: Relation<PermissionSetEntity>;
}
