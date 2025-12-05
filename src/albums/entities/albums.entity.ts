import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('albums')
export class AlbumsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  artistId: string;
}
