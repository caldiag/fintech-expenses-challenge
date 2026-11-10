import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/BaseEntity.ts';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.ts';
import { RoleEntity } from '../../permissions/entities/role.entity.ts';
import { PermissionSetEntity } from '../../permissions/entities/permission-set.entity.ts';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  passwordHash: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.createdBy)
  transactions: Relation<TransactionEntity[]>;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: true })
  role: Relation<RoleEntity>;

  @OneToOne(() => PermissionSetEntity, (permissionSet) => permissionSet.user)
  permissionSet: Relation<PermissionSetEntity> | null;
}
