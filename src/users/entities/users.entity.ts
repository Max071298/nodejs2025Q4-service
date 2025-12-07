import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  login: string;

  @Column('text')
  password: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;
    return { id, login, version, createdAt, updatedAt };
  }
}
