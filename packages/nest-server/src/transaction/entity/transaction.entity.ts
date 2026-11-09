import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity.js';
import { Currency } from '@app/types';
import { CategoryEntity } from '../../category/entity/category.entity.js';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Number)
  amount: number;

  @Column(() => Number)
  amountCents: number;

  @Column(() => String)
  currency: Currency;

  @Column(() => String)
  description: string;

  @ManyToOne(() => CategoryEntity, (category) => category.transactions)
  category: Relation<CategoryEntity>;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  createdBy: Relation<UserEntity>;
}
