import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactEntity } from '../../contact/entities/contact.entity.ts';
import { TransactionEntity } from '../../transaction/entities/transaction.entity.ts';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';

@Entity()
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  websiteUrl: string;

  @Column('varchar', { nullable: true })
  areaCode: string | null;

  @Column('varchar', { nullable: true })
  email: string | null;

  @Column('varchar', { nullable: true })
  phone: string | null;

  @ManyToOne(() => UserEntity)
  createdBy: Relation<UserEntity>;

  @ManyToMany(() => ContactEntity, (contact) => contact.companies)
  @JoinTable()
  contacts: Relation<ContactEntity[]>;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.company)
  transactions: Relation<TransactionEntity[]>;
}
