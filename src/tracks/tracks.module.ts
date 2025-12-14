import { forwardRef, Module } from '@nestjs/common';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavsModule } from 'src/favs/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/tracks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackEntity]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
