import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class ArtistsService {
  private readonly artists: Artist[] = [];
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
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
    if (name === undefined || typeof grammy !== 'boolean')
      throw new Error('Request body does not contain required fields');
    const isALreadyExist = this.artists.find((artist) => artist.name === name);
    if (isALreadyExist) throw new Error('Current artist already exists');

    const id = randomUUID();

    const newArtist = { id, name, grammy };
    this.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, createArtistDto: CreateArtistDto) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new Error('Artist not found');

    const { name, grammy } = createArtistDto;
    if (name === undefined && typeof grammy !== 'boolean')
      throw new Error('Request body does not contain required fields');

    if (name) artist.name = name;
    if (typeof grammy === 'boolean') artist.grammy = grammy;

    return artist;
  }

  delete(id: string) {
    const artistPos = this.artists.findIndex((artist) => artist.id === id);

    if (artistPos === -1) throw new Error('Artist not found');

    this.artists.splice(artistPos, 1);
    this.albumsService.removeArtistfromAlbums(id);

    return `Artist with id ${id} successfully deleted`;
  }
}
