import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tracks')
export class TracksEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  artistId: string;

  @Column()
  albumId: string;

  @Column()
  duration: number;
}
