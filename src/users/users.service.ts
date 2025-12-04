import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(UsersEntity)
  private usersRepository: Repository<UsersEntity>;

  private readonly users: User[] = [];

  async create(user: CreateUserDto): Promise<Partial<User>> {
    const { login, password } = user;
    if (typeof login !== 'string' || typeof password !== 'string')
      throw new Error('Request body does not contain required fields');

    const isALreadyExist = await this.usersRepository.findOneBy({
      login: login,
    });

    if (isALreadyExist) throw new Error('Current user already exists');

    const newUser = await this.usersRepository.create(user);

    newUser.id = randomUUID();
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
      throw new Error('User not found');
    } else {
      return user.toResponse();
    }
  }

  async updatePassword(
    id: string,
    updatePassword: UpdatePasswordDto,
  ): Promise<Partial<User>> {
    if (
      updatePassword.oldPassword === undefined ||
      updatePassword.newPassword === undefined
    )
      throw new Error('Request body does not contain required fields');

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');

    if (user.password !== updatePassword.oldPassword)
      throw new Error('Invalid old password');
    user.password = updatePassword.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    return (await this.usersRepository.save(user)).toResponse();
  }

  async delete(id: string): Promise<string> {
    const result = await this.usersRepository.delete(id);

    if (result.affected) return `User with id ${id} successfully deleted`;

    throw new NotFoundException('User not found');
  }
}
