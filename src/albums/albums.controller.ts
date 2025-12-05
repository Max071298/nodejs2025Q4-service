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
  async findAll(): Promise<Album[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    return this.albumsService.findOne(id);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    return await this.albumsService.update(id, createAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    return await this.albumsService.delete(id);
  }
}
