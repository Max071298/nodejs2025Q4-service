import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  findAll(): Track[] {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Track {
    try {
      return this.tracksService.findOne(id);
    } catch (e) {
      if (e.message === 'Track not found') {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    try {
      return this.tracksService.create(createTrackDto);
    } catch (e) {
      if (e.message === 'Request body does not contain required fields') {
        throw new HttpException(
          'Request body does not contain required fields',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Album not found') {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    try {
      return this.tracksService.update(id, createTrackDto);
    } catch (e) {
      if (e.message === 'Track not found') {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Artist not found') {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Album not found') {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): string {
    try {
      return this.tracksService.delete(id);
    } catch (e) {
      if (e.message === 'Track not found') {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
