import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => String)
  firstName: string;

  @Column(() => String)
  lastName: string;

  @Column(() => String)
  email: string;

  @Column(() => String)
  passwordHash: string;
}
