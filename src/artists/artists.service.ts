import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entities/artists.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  @InjectRepository(ArtistEntity)
  private readonly artistsRepository: Repository<ArtistEntity>;

  async findAll(): Promise<Artist[]> {
    const artists = await this.artistsRepository.find();
    return artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.artistsRepository.create(createArtistDto);

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

    if (result.affected) return '';

    throw new NotFoundException('Artist not found');
  }
}
