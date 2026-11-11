import { PermissionScope } from '@app/types';
import type { Relation } from 'typeorm';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { RoleEntity } from './role.entity.ts';

@Entity()
//a permission either applies to one user or one role, never both and never neither
@Check(
  'CHK_permission_set_exactly_one_owner',
  '("roleId" IS NOT NULL) <> ("userId" IS NOT NULL)',
)
export class PermissionSetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  transactionCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  transactionReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  transactionUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  transactionDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  companyCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  companyReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  companyUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  companyDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  contactCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  contactReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  contactUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  contactDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  categoryCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  categoryReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  categoryUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  categoryDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  userCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  userReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  userUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  userDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  roleCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  roleReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  roleUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
    default: PermissionScope.OWN,
  })
  roleDeleteScope: PermissionScope;

  @OneToOne(() => RoleEntity, (role) => role.permissionSet, {
    nullable: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: Relation<RoleEntity> | null;

  @OneToOne(() => UserEntity, (user) => user.permissionSet, {
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity> | null;
}
