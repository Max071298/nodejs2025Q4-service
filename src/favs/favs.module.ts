import { forwardRef, Module } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavsEntity } from './entities/favs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavsEntity]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
