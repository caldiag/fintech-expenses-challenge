import { Currency } from '@app/types';
import type { Relation } from 'typeorm';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity.ts';
import { RoleEntity } from '../../permissions/entities/role.entity.ts';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { TransactionCategoryEntity } from './transaction-category.entity.ts';

@Entity()
@Check('CHK_transaction_amount_cents_max', '"amountCents" <= 100')
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
    { nullable: false },
  )
  transactionCategory: Relation<TransactionCategoryEntity>;

  @ManyToOne(() => RoleEntity, (role) => role.transactions, { nullable: false })
  role: Relation<RoleEntity>;

  @ManyToOne(() => CompanyEntity, (company) => company.transactions, {
    nullable: false,
  })
  company: Relation<CompanyEntity>;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  createdBy: Relation<UserEntity>;
}
