import { AlbumEntity } from 'src/albums/entities/albums.entity';
import { ArtistEntity } from 'src/artists/entities/artists.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column({
    type: 'numeric',
    nullable: false,
    transformer: {
      from: (value: number | string) =>
        typeof value === 'string' ? parseInt(value, 10) : value,
      to: (value: number) => value,
    },
  })
  duration: number;

  @ManyToOne(() => ArtistEntity, (artist) => artist.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId' })
  album: AlbumEntity;
}
