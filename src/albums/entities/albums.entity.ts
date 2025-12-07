import { ArtistEntity } from 'src/artists/entities/artists.entity';
import { TrackEntity } from 'src/tracks/entities/tracks.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('albums')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.artist)
  tracks: TrackEntity[];
}
