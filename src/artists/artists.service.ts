import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistsEntity } from './entities/artists.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  @InjectRepository(ArtistsEntity)
  private readonly artistsRepository: Repository<ArtistsEntity>;

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll(): Promise<Artist[]> {
    try {
      const artists = await this.artistsRepository.find();
      return artists;
    } catch (e) {
      console.error(e);
    }
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const id = randomUUID();

    const newArtist = await this.artistsRepository.create(
      Object.assign({}, { id }, createArtistDto),
    );

    return await this.artistsRepository.save(newArtist);
  }

  async update(id: string, createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    const updatedArtist = await this.artistsRepository.findOne({
      where: { id },
    });
    if (!updatedArtist) throw new NotFoundException('Artist not found');

    updatedArtist.name = name;
    updatedArtist.grammy = grammy;

    return await this.artistsRepository.save(updatedArtist);
  }

  async delete(id: string) {
    const result = await this.artistsRepository.delete(id);

    if (result.affected) {
      this.favsService.deleteArtist(id, false);
      this.albumsService.removeArtistfromAlbums(id);
      this.tracksService.removeArtistFromTracks(id);
      return '';
    }

    throw new NotFoundException('Artist not found');
  }
}
