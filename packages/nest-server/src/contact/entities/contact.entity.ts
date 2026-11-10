import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../typeorm/entities/base-entity.ts';
import { UserEntity } from '../../user/entities/user.entity.ts';
import { CompanyEntity } from '../../company/entities/company.entity.ts';

@Entity()
export class ContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  avatarUrl: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @ManyToMany(() => CompanyEntity, (company) => company.contacts, {
    nullable: false,
  })
  companies: Relation<CompanyEntity[]>;

  @ManyToOne(() => UserEntity)
  createdBy: Relation<UserEntity>;
}
