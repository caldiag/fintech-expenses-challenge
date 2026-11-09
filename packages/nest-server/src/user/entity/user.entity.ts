import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CategoryEntity } from '../../category/entity/category.entity.js';
import { TransactionEntity } from '../../transaction/entity/transaction.entity.js';
import { RoleEntity } from '../../role/entity/role.entity.js';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => String)
  firstName: string;

  @Column(() => String)
  lastName: string;

  @Column(() => String)
  email: string;

  @Column(() => String)
  passwordHash: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.createdBy)
  transactions: Relation<TransactionEntity[]>;

  @OneToMany(() => CategoryEntity, (category) => category.createdBy)
  categories: Relation<CategoryEntity[]>;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: Relation<RoleEntity[]>;
}
