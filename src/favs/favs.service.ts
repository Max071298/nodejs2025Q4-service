import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Favs } from './interfaces/favs.interface';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavsResponse } from './interfaces/favs-response.interface';

@Injectable()
export class FavsService {
  private readonly favs: Favs = { artists: [], albums: [], tracks: [] };

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavsResponse> {
    return {
      artists: await this.favs.artists.map(
        async (artistId) => await this.artistsService.findOne(artistId),
      ),
      albums: this.favs.albums.map((albumId) =>
        this.albumsService.findOne(albumId),
      ),
      tracks: this.favs.tracks.map((trackId) =>
        this.tracksService.findOne(trackId),
      ),
    };
  }

  addTrack(id: string): string {
    this.tracksService.findOne(id);
    const isAlreadyInFavs = this.favs.tracks.find((trackId) => trackId === id);

    if (isAlreadyInFavs) return `Track with id ${id} is already in favorites`;

    this.favs.tracks.push(id);
    return `Track with id ${id} was successfully added to favorites`;
  }

  deleteTrack(id: string, withErrorHandler: boolean): string {
    const trackPos = this.favs.tracks.findIndex((trackId) => trackId === id);
    if (trackPos === -1) {
      if (withErrorHandler) {
        throw new Error('Track is not favorite');
      } else return '';
    }

    this.favs.tracks.splice(trackPos, 1);
    return `Track with id ${id} was successfully deleted from favorites`;
  }

  addAlbum(id: string): string {
    this.albumsService.findOne(id);
    const isAlreadyInFavs = this.favs.albums.find((albumId) => albumId === id);

    if (isAlreadyInFavs) return `Album with id ${id} is already in favorites`;

    this.favs.albums.push(id);
    return `Album with id ${id} was successfully added to favorites`;
  }

  deleteAlbum(id: string, withErrorHandler: boolean): string {
    const albumPos = this.favs.albums.findIndex((albumId) => albumId === id);
    if (albumPos === -1) {
      if (withErrorHandler) {
        throw new Error('Album is not favorite');
      } else return '';
    }

    this.favs.albums.splice(albumPos, 1);
    return `Album with id ${id} was successfully deleted from favorites`;
  }

  addArtist(id: string): string {
    this.artistsService.findOne(id);

    const isAlreadyInFavs = this.favs.artists.find(
      (artistId) => artistId === id,
    );

    if (isAlreadyInFavs) return `Artist with id ${id} is already in favorites`;

    this.favs.artists.push(id);
    return `Artist with id ${id} was successfully added to favorites`;
  }

  deleteArtist(id: string, withErrorHandler: boolean): string {
    const artistPos = this.favs.artists.findIndex(
      (artistId) => artistId === id,
    );
    if (artistPos === -1) {
      if (withErrorHandler) {
        throw new Error('Artist is not favorite');
      } else return '';
    }

    this.favs.artists.splice(artistPos, 1);
    return `Artist with id ${id} was successfully deleted from favorites`;
  }
}
