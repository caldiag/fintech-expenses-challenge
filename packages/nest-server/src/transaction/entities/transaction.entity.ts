import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/BaseEntity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { Currency } from '@app/types';
import { TransactionCategoryEntity } from './transaction-category.entity.ts';

@Entity()
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  amount: number;

  @Column('integer')
  amountCents: number;

  @Column({ type: 'enum', enum: Currency, enumName: 'currency' })
  currency: Currency;

  @Column('varchar')
  description: string;

  @ManyToOne(
    () => TransactionCategoryEntity,
    (category) => category.transactions,
  )
  transactionCategory: Relation<TransactionCategoryEntity>;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  createdBy: Relation<UserEntity>;
}
