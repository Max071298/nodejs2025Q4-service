import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ArtistsService } from 'src/artists/artists.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TracksEntity } from './entities/tracks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TracksService {
  @InjectRepository(TracksEntity)
  private readonly tracksRepository: Repository<TracksEntity>;

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

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

    if (artistId) {
      await this.artistsService.findOne(artistId);
    }

    if (albumId) {
      await this.albumsService.findOne(albumId);
    }

    const id = randomUUID();

    const newTrack = await this.tracksRepository.create(
      Object.assign({}, { id }, createTrackDto),
    );

    return await this.tracksRepository.save(newTrack);
  }

  async update(id: string, createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.tracksRepository.findOne({ where: { id } });

    if (!newTrack) throw new NotFoundException('Track not found');

    const { name, artistId, albumId, duration } = createTrackDto;

    if (newTrack === undefined || newTrack === undefined)
      throw new BadRequestException(
        'artistId and albumId must be identified (or be null)',
      );

    if (newTrack) {
      const artist = await this.artistsService.findOne(artistId);
      if (artist) newTrack.artistId = artistId;
    }

    if (albumId) {
      const album = await this.albumsService.findOne(albumId);
      if (album) newTrack.albumId = albumId;
    }

    if (!artistId) newTrack.artistId = artistId;
    if (!albumId) newTrack.albumId = albumId;

    newTrack.name = name;
    newTrack.duration = duration;

    return await this.tracksRepository.save(newTrack);
  }

  async delete(id: string): Promise<string> {
    const result = await this.tracksRepository.delete(id);

    if (result.affected) {
      this.favsService.deleteTrack(id, false);
      return '';
    }

    throw new NotFoundException('Track not found');
  }

  async removeArtistFromTracks(id: string): Promise<void> {
    (await this.tracksRepository.find({ where: { artistId: id } })).forEach(
      async (newTrack) => {
        newTrack.artistId = null;
        await this.tracksRepository.save(newTrack);
      },
    );
  }

  async removeAlbumFromTracks(id: string): Promise<void> {
    (await this.tracksRepository.find({ where: { albumId: id } })).forEach(
      async (newTrack) => {
        newTrack.albumId = null;
        await this.tracksRepository.save(newTrack);
      },
    );
  }
}
