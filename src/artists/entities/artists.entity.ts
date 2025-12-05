import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('artists')
export class ArtistsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
