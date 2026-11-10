import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { TransactionEntity } from './transaction.entity.ts';

@Entity()
export class TransactionCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  icon: string;

  @ManyToOne(() => UserEntity)
  createdBy: Relation<UserEntity>;

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.transactionCategory,
  )
  transactions: Relation<TransactionEntity[]>;
}
