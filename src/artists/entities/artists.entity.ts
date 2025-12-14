import { AlbumEntity } from 'src/albums/entities/albums.entity';
import { TrackEntity } from 'src/tracks/entities/tracks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artists')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'bool', nullable: false })
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist)
  tracks: TrackEntity[];
}
