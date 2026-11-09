import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity.js';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => String)
  name: string;

  @Column(() => String)
  icon: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: Relation<UserEntity[]>;
}
