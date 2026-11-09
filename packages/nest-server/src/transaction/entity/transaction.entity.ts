import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity.js';
import { Currency } from '@app/types';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Number)
  amount: number;

  @Column(() => Number)
  amountCents: number;

  @Column()
  currency: Currency;

  @Column(() => String)
  description: string;

  @OneToMany(() => UserEntity, (user) => user.id)
  createdBy: UserEntity;
}
