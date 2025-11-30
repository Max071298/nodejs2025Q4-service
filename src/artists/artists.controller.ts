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
import { ArtistsService } from './artists.service';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  findAll(): Artist[] {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Artist {
    try {
      return this.artistsService.findOne(id);
    } catch (e) {
      if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    try {
      return this.artistsService.create(createArtistDto);
    } catch (e) {
      if (e.message === 'Request body does not contain required fields') {
        throw new HttpException(
          'Request body does not contain required fields',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.message === 'Current artist already exists') {
        throw new HttpException(
          'Current artist already exists',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    try {
      return this.artistsService.update(id, createArtistDto);
    } catch (e) {
      if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else if (
        e.message === 'Request body does not contain required fields'
      ) {
        throw new HttpException(
          'Request body does not contain required fields',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): string {
    try {
      return this.artistsService.delete(id);
    } catch (e) {
      if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
