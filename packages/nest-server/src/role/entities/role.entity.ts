import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { PermissionSetEntity } from '../../permissions/entities/permission-set.entity.ts';

@Entity()
export class RoleEntity {
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
