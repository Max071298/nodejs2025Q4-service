import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/albums.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  @InjectRepository(AlbumEntity)
  private readonly albumsRepository: Repository<AlbumEntity>;

  async findAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      const newAlbum = await this.albumsRepository.create(createAlbumDto);
      return await this.albumsRepository.save(newAlbum);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23503') {
        throw new UnprocessableEntityException(
          'Artist with provided artistId doesn"t exist',
        );
      }
    }
  }

  async update(id: string, createAlbumDto: CreateAlbumDto): Promise<Album> {
    const updatedAlbum = await this.albumsRepository.findOne({ where: { id } });
    if (!updatedAlbum) throw new NotFoundException('Album not found');

    const { name, year, artistId } = createAlbumDto;

    updatedAlbum.artistId = artistId;
    updatedAlbum.name = name;
    updatedAlbum.year = year;

    try {
      return await this.albumsRepository.save(updatedAlbum);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23503') {
        throw new UnprocessableEntityException(
          'Artist with provided artistId doesn"t exist',
        );
      }
    }
  }

  async delete(id: string) {
    const result = await this.albumsRepository.delete(id);

    if (result.affected) return '';

    throw new NotFoundException('Album not found');
  }
}
