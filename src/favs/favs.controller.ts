import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private favsService: FavsService) {}

  @Get()
  async findAll() {
    return await this.favsService.findAll();
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
  @HttpCode(204)
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favsService.deleteTrack(id);
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
  @HttpCode(204)
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favsService.deleteAlbum(id);
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
  @HttpCode(204)
  deleteArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favsService.deleteArtist(id);
  }
}
