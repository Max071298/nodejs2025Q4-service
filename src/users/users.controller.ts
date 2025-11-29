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
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Partial<User>[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Partial<User> {
    try {
      return this.usersService.findOne(id);
    } catch (e) {
      if (e.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (e) {
      if (e.message === 'Request body does not contain required fields') {
        throw new HttpException(
          'Request body does not contain required fields',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.message === 'Current user already exists') {
        throw new HttpException(
          'Current user already exists',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @Put(':id')
  updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      return this.usersService.updatePassword(id, updatePasswordDto);
    } catch (e) {
      if (e.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else if (e.message === 'Invalid old password') {
        throw new HttpException('Invalid old password', HttpStatus.FORBIDDEN);
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
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): string {
    try {
      return this.usersService.delete(id);
    } catch (e) {
      if (e.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
