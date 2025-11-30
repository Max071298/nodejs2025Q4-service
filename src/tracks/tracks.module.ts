import { forwardRef, Module } from '@nestjs/common';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
