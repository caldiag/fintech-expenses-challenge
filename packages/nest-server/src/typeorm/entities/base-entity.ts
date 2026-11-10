import {
  BaseEntity as TypeOrmBaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
