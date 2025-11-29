import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ArtistsController } from './artists/artists.controller';
import { ArtistsService } from './artists/artists.service';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [ArtistsModule, AlbumsModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
