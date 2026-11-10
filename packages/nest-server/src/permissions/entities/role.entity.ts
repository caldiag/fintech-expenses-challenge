import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
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

  @OneToOne(() => PermissionSetEntity, (permissionSet) => permissionSet.role)
  permissionSet: Relation<PermissionSetEntity>;
}
