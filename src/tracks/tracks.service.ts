import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './entities/tracks.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class TracksService {
  @InjectRepository(TrackEntity)
  private readonly tracksRepository: Repository<TrackEntity>;

  async findAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });

    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { artistId, albumId } = createTrackDto;
    if (artistId === undefined || albumId === undefined)
      throw new BadRequestException(
        'artistId and albumId must be identified (or be null)',
      );
    try {
      const newTrack = await this.tracksRepository.create(createTrackDto);

      return await this.tracksRepository.save(newTrack);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23503') {
        if (err.driverError.constraint === 'tracks_artistid_fkey')
          throw new UnprocessableEntityException(
            'Artist with provided artistId doesn"t exist',
          );

        if (err.driverError.constraint === 'tracks_albumid_fkey')
          throw new UnprocessableEntityException(
            'Album with provided albumId doesn"t exist',
          );
      }
    }
  }

  async update(id: string, createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.tracksRepository.findOne({ where: { id } });

    if (!newTrack) throw new NotFoundException('Track not found');

    const { name, artistId, albumId, duration } = createTrackDto;

    if (newTrack === undefined || newTrack === undefined)
      throw new BadRequestException(
        'artistId and albumId must be identified (or be null)',
      );

    newTrack.artistId = artistId;
    newTrack.albumId = albumId;
    newTrack.name = name;
    newTrack.duration = duration;

    try {
      return await this.tracksRepository.save(newTrack);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23503') {
        if (err.driverError.constraint === 'tracks_artistid_fkey')
          throw new UnprocessableEntityException(
            'Artist with provided artistId doesn"t exist',
          );

        if (err.driverError.constraint === 'tracks_albumid_fkey')
          throw new UnprocessableEntityException(
            'Album with provided albumId doesn"t exist',
          );
      }
    }
  }

  async delete(id: string): Promise<string> {
    const result = await this.tracksRepository.delete(id);

    if (result.affected) {
      return '';
    }

    throw new NotFoundException('Track not found');
  }
}
