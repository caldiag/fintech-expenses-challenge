import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { ContactEntity } from '../../contact/entities/contact.entity.ts';

@Entity()
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  areaCode: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @ManyToOne(() => UserEntity)
  createdBy: Relation<UserEntity>;

  @ManyToMany(() => ContactEntity, (contact) => contact.companies)
  @JoinTable()
  contacts: Relation<ContactEntity[]>;
}
