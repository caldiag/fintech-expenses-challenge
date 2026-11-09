import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { Currency } from '@app/types';
import { CategoryEntity } from '../../category/entities/category.entity.ts';

@Entity()
export class TransactionEntity {
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

  @ManyToOne(() => CategoryEntity, (category) => category.transactions)
  category: Relation<CategoryEntity>;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  createdBy: Relation<UserEntity>;
}
