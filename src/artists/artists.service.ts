import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class ArtistsService {
  private readonly artists: Artist[] = [];
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) throw new Error('Artist not found');
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (typeof name !== 'string' || typeof grammy !== 'boolean')
      throw new Error('Request body does not contain required fields');

    const id = randomUUID();

    const newArtist = { id, name, grammy };
    this.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (typeof name !== 'string' && typeof grammy !== 'boolean')
      throw new Error('Request body does not contain required fields');

    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new Error('Artist not found');

    if (name) artist.name = name;
    if (typeof grammy === 'boolean') artist.grammy = grammy;

    return artist;
  }

  delete(id: string) {
    const artistPos = this.artists.findIndex((artist) => artist.id === id);

    if (artistPos === -1) throw new Error('Artist not found');

    this.favsService.deleteArtist(id, false);
    this.artists.splice(artistPos, 1);
    this.albumsService.removeArtistfromAlbums(id);
    this.tracksService.removeArtistFromTracks(id);

    return `Artist with id ${id} successfully deleted`;
  }
}
