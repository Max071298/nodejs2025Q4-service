import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsResponse } from './interfaces/favs-response.interface';

@Controller('favs')
export class FavsController {
  constructor(private favsService: FavsService) {}

  @Get()
  findAll(): FavsResponse {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.addTrack(id);
    } catch (e) {
      if (e.message === 'Track not found') {
        throw new HttpException(
          'Track not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  @Delete('track/:id')
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.deleteTrack(id, true);
    } catch (e) {
      if (e.message === 'Track is not favorite')
        throw new HttpException('Track is not favorite', HttpStatus.NOT_FOUND);
    }
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.addAlbum(id);
    } catch (e) {
      if (e.message === 'Album not found') {
        throw new HttpException(
          'Album not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  @Delete('album/:id')
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.deleteAlbum(id, true);
    } catch (e) {
      if (e.message === 'Album is not favorite')
        throw new HttpException('Album is not favorite', HttpStatus.NOT_FOUND);
    }
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.addArtist(id);
    } catch (e) {
      if (e.message === 'Artist not found') {
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  @Delete('artist/:id')
  deleteArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.favsService.deleteArtist(id, true);
    } catch (e) {
      if (e.message === 'Artist is not favorite')
        throw new HttpException('Artist is not favorite', HttpStatus.NOT_FOUND);
    }
  }
}
