import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FavsEntity } from './entities/favs.entity';
import { Repository } from 'typeorm';
import { TrackEntity } from 'src/tracks/entities/tracks.entity';
import { AlbumEntity } from 'src/albums/entities/albums.entity';
import { ArtistEntity } from 'src/artists/entities/artists.entity';

@Injectable()
export class FavsService {
  @InjectRepository(FavsEntity)
  private readonly favsRepository: Repository<FavsEntity>;

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  async findAll() {
    let favs = await this.favsRepository.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favs)
      favs = await this.favsRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });

    await await this.favsRepository.save(favs);

    return favs;
  }

  async addTrack(id: string): Promise<string> {
    const favs = await this.findAll();

    if (favs.tracks.find((track) => track.id === id))
      return `Track with id ${id} is already in favorites`;

    try {
      const track = (await this.tracksService.findOne(id)) as TrackEntity;

      favs.tracks.push(track);

      await this.favsRepository.save(favs);

      return `Track with id ${id} was successfully added to favorites`;
    } catch (e) {
      if (e) throw new UnprocessableEntityException('Track not found');
    }
  }

  async deleteTrack(id: string) {
    const favs = await this.findAll();

    const trackPos = favs.tracks.findIndex((track) => track.id === id);

    if (trackPos === -1) throw new NotFoundException('Track is not favorite');

    favs.tracks.splice(trackPos, 1);
    await this.favsRepository.save(favs);

    return ``;
  }

  async addAlbum(id: string) {
    const favs = await this.findAll();

    if (favs.albums.find((album) => album.id === id))
      return `Album with id ${id} is already in favorites`;

    try {
      const album = (await this.albumsService.findOne(id)) as AlbumEntity;

      favs.albums.push(album);

      await this.favsRepository.save(favs);
      return `Album with id ${id} was successfully added to favorites`;
    } catch (e) {
      if (e) throw new UnprocessableEntityException('Album not found');
    }
  }

  async deleteAlbum(id: string) {
    const favs = await this.findAll();

    const albumPos = favs.albums.findIndex((album) => album.id === id);

    if (albumPos === -1) throw new NotFoundException('Album is not favorite');

    favs.albums.splice(albumPos, 1);
    await this.favsRepository.save(favs);

    return ``;
  }

  async addArtist(id: string) {
    const favs = await this.findAll();

    if (favs.artists.find((artist) => artist.id === id))
      return `Artist with id ${id} is already in favorites`;

    try {
      const artist = (await this.artistsService.findOne(id)) as ArtistEntity;

      favs.artists.push(artist);

      await this.favsRepository.save(favs);

      return `Artist with id ${id} was successfully added to favorites`;
    } catch (e) {
      if (e) throw new UnprocessableEntityException('Artist not found');
    }
  }

  async deleteArtist(id: string) {
    const favs = await this.findAll();

    const artistPos = favs.artists.findIndex((artist) => artist.id === id);

    if (artistPos === -1) throw new NotFoundException('Artist is not favorite');

    favs.artists.splice(artistPos, 1);
    await this.favsRepository.save(favs);

    return ``;
  }
}
