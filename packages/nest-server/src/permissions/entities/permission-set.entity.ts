import { PermissionScope } from '@app/types';
import {
  Check,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/BaseEntity.ts';
import { RoleEntity } from '../../role/entities/role.entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';

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
  })
  transactionCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  transactionReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  transactionUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  transactionDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  categoryCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  categoryReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  categoryUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  categoryDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  userCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  userReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  userUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  userDeleteScope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  roleCreateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  roleReadScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
  })
  roleUpdateScope: PermissionScope;
  @Column({
    type: 'enum',
    enum: PermissionScope,
    enumName: 'permission_scope',
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
