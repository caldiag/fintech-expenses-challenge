import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity.js';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.js';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => String)
  name: string;

  @Column(() => String)
  description: string;

  @Column(() => String)
  icon: string;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  createdBy: Relation<UserEntity>;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: Relation<TransactionEntity[]>;
}
