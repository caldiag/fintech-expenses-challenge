import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.ts';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  icon: string;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  createdBy: Relation<UserEntity>;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: Relation<TransactionEntity[]>;
}
