import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('track')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    return await this.tracksService.findOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return await this.tracksService.update(id, createTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    return await this.tracksService.delete(id);
  }
}
