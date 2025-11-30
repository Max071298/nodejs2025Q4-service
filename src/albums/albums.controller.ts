import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  findAll(): Album[] {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Album {
    try {
      return this.albumsService.findOne(id);
    } catch (e) {
      if (e.message === 'Album not found') {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    try {
      return this.albumsService.create(createAlbumDto);
    } catch (e) {
      if (e.message === 'Request body does not contain required fields') {
        throw new HttpException(
          'Request body does not contain required fields',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    try {
      return this.albumsService.update(id, createAlbumDto);
    } catch (e) {
      if (e.message === 'Album not found') {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Invalid dto') {
        throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): string {
    try {
      return this.albumsService.delete(id);
    } catch (e) {
      if (e.message === 'Album not found') {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
