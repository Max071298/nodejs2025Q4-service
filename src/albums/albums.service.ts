import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumsEntity } from './entities/albums.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  @InjectRepository(AlbumsEntity)
  private readonly albumsRepository: Repository<AlbumsEntity>;

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async removeArtistfromAlbums(id: string): Promise<void> {
    (await this.albumsRepository.find({ where: { artistId: id } })).forEach(
      async (newAlbum) => {
        newAlbum.artistId = null;
        await this.albumsRepository.save(newAlbum);
      },
    );
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId)
      await this.artistsService.findOne(createAlbumDto.artistId);

    const id = randomUUID();

    const newAlbum = await this.albumsRepository.create(
      Object.assign({}, { id }, createAlbumDto),
    );

    return await this.albumsRepository.save(newAlbum);
  }

  async update(id: string, createAlbumDto: CreateAlbumDto): Promise<Album> {
    const updatedAlbum = await this.albumsRepository.findOne({ where: { id } });
    if (!updatedAlbum) throw new NotFoundException('Album not found');

    const { name, year, artistId } = createAlbumDto;

    if (artistId) {
      const artist = await this.artistsService.findOne(artistId);
      if (artist) updatedAlbum.artistId = artistId;
    }

    if (artistId === null) updatedAlbum.artistId = artistId;

    updatedAlbum.name = name;
    updatedAlbum.year = year;

    return await this.albumsRepository.save(updatedAlbum);
  }

  async delete(id: string) {
    const result = await this.albumsRepository.delete(id);

    if (result.affected) {
      this.favsService.deleteAlbum(id, false);
      this.tracksService.removeAlbumFromTracks(id);
      return '';
    }

    throw new NotFoundException('Album not found');
  }
}
