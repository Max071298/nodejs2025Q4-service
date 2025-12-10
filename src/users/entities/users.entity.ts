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

  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      from: (value: number | string) =>
        typeof value === 'string' ? parseInt(value, 10) : value,
      to: (value: number) => value,
    },
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      from: (value: number | string) =>
        typeof value === 'string' ? parseInt(value, 10) : value,
      to: (value: number) => value,
    },
  })
  updatedAt: number;

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;
    return { id, login, version, createdAt, updatedAt };
  }
}
