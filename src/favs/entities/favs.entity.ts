import { AlbumEntity } from 'src/albums/entities/albums.entity';
import { ArtistEntity } from 'src/artists/entities/artists.entity';
import { TrackEntity } from 'src/tracks/entities/tracks.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favs')
export class FavsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => ArtistEntity, { eager: true })
  @JoinTable({
    name: 'favs_artists',
    joinColumn: {
      name: 'favId',
      referencedColumnName: 'id',
    },

    inverseJoinColumn: {
      name: 'artistId',
      referencedColumnName: 'id',
    },
  })
  artists: ArtistEntity[];

  @ManyToMany(() => AlbumEntity, { eager: true })
  @JoinTable({
    name: 'favs_albums',
    joinColumn: {
      name: 'favId',
      referencedColumnName: 'id',
    },

    inverseJoinColumn: {
      name: 'albumId',
      referencedColumnName: 'id',
    },
  })
  albums: AlbumEntity[];

  @ManyToMany(() => TrackEntity, { eager: true })
  @JoinTable({
    name: 'favs_tracks',
    joinColumn: {
      name: 'favId',
      referencedColumnName: 'id',
    },

    inverseJoinColumn: {
      name: 'trackId',
      referencedColumnName: 'id',
    },
  })
  tracks: TrackEntity[];
}
