import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class AlbumsService {
  private readonly albums: Album[] = [];
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);

    if (!album) throw new Error('Album not found');
    return album;
  }

  removeArtistfromAlbums(id: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }

  create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    if (
      typeof name !== 'string' ||
      typeof year !== 'number' ||
      (typeof artistId !== 'string' && artistId !== null)
    )
      throw new Error('Request body does not contain required fields');

    if (typeof artistId === 'string') {
      this.artistsService.findOne(artistId);
    }

    const id = randomUUID();

    const newAlbum = { id, name, year, artistId };
    this.albums.push(newAlbum);

    return newAlbum;
  }

  update(id: string, createAlbumDto: CreateAlbumDto) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new Error('Album not found');

    const { name, year, artistId } = createAlbumDto;

    if (typeof artistId === 'string') {
      const artist = this.artistsService.findOne(artistId);
      if (artist) album.artistId = artistId;
    }

    if (artistId === null) album.artistId = artistId;

    if (typeof name === 'string') album.name = name;
    if (typeof year === 'number') album.year = year;

    return album;
  }

  delete(id: string) {
    const albumPos = this.albums.findIndex((album) => album.id === id);

    if (albumPos === -1) throw new Error('Album not found');

    this.favsService.deleteAlbum(id, false);
    this.albums.splice(albumPos, 1);
    this.tracksService.removeAlbumFromTracks(id);

    return `Album with id ${id} successfully deleted`;
  }
}
