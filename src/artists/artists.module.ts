import { forwardRef, Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavsModule } from 'src/favs/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsEntity } from './entities/artists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistsEntity]),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavsModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
