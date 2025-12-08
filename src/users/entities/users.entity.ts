import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  login: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'int', default: 1, nullable: false })
  version: number;

  @Column({ type: 'bigint', nullable: false })
  createdAt: number;

  @Column({ type: 'bigint', nullable: false })
  updatedAt: number;

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;
    return { id, login, version, createdAt, updatedAt };
  }
}
