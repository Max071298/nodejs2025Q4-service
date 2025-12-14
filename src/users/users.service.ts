import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>;

  async create(user: CreateUserDto): Promise<Partial<User>> {
    const { login, password } = user;

    const isALreadyExist = await this.usersRepository.findOneBy({
      login: login,
    });

    if (isALreadyExist)
      throw new ForbiddenException('Current user already exists');

    const newUser = await this.usersRepository.create(user);

    newUser.password = password;
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = newUser.createdAt;

    return (await this.usersRepository.save(newUser)).toResponse();
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => user.toResponse());
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      return user.toResponse();
    }
  }
  async findOneByLogin(login: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      login: login,
    });
  }

  async updatePassword(
    id: string,
    updatePassword: UpdatePasswordDto,
  ): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== updatePassword.oldPassword)
      throw new ForbiddenException('Invalid old password');

    user.password = updatePassword.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    return (await this.usersRepository.save(user)).toResponse();
  }

  async delete(id: string): Promise<string> {
    const result = await this.usersRepository.delete(id);

    if (result.affected) return '';

    throw new NotFoundException('User not found');
  }
}
