import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ArtistsService } from 'src/artists/artists.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TracksService {
  private readonly tracks: Track[] = [];
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) throw new Error('Track not found');
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    if (
      typeof name !== 'string' ||
      typeof duration !== 'number' ||
      (typeof artistId !== 'string' && artistId !== null) ||
      (typeof albumId !== 'string' && albumId !== null)
    )
      throw new Error('Request body does not contain required fields');

    if (typeof artistId === 'string') {
      this.artistsService.findOne(artistId);
    }

    if (typeof albumId === 'string') {
      this.albumsService.findOne(albumId);
    }

    const id = randomUUID();

    const newTrack = { id, name, artistId, albumId, duration };
    this.tracks.push(newTrack);

    return newTrack;
  }

  update(id: string, createTrackDto: CreateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new Error('Track not found');

    const { name, artistId, albumId, duration } = createTrackDto;

    if (typeof artistId === 'string') {
      const artist = this.artistsService.findOne(artistId);
      if (artist) track.artistId = artistId;
    }

    if (typeof albumId === 'string') {
      const album = this.albumsService.findOne(albumId);
      if (album) track.albumId = albumId;
    }

    if (artistId === null) track.artistId = artistId;
    if (albumId === null) track.albumId = albumId;

    if (typeof name === 'string') track.name = name;
    if (typeof duration === 'number') track.duration = duration;

    return track;
  }

  delete(id: string) {
    const trackPos = this.tracks.findIndex((track) => track.id === id);

    if (trackPos === -1) throw new Error('Track not found');

    this.favsService.deleteTrack(id, false);
    this.tracks.splice(trackPos, 1);

    return `Track with id ${id} successfully deleted`;
  }

  removeArtistFromTracks(id: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
  }

  removeAlbumFromTracks(id: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }
}
