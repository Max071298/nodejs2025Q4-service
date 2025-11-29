import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: CreateUserDto) {
    const { login, password } = user;
    if (login === undefined || password === undefined)
      throw new Error('Request body does not contain required fields');
    const isALreadyExist = this.users.find((user) => user.login === login);
    if (isALreadyExist) throw new Error('Current user already exists');

    const id = randomUUID();
    const version = 0;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const newUser = { login, password, id, version, createdAt, updatedAt };
    this.users.push(newUser);
    return { login, id, version, createdAt, updatedAt };
  }

  findAll(): Partial<User>[] {
    return this.users.map((user) => {
      const { password, ...formattedUser } = user;
      return formattedUser;
    });
  }

  findOne(id: string): Partial<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const { password, ...formattedUser } = user;
      return formattedUser;
    }
  }

  updatePassword(id: string, updatePassword: UpdatePasswordDto): Partial<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new Error('User not found');
    if (
      updatePassword.oldPassword === undefined ||
      updatePassword.newPassword === undefined
    )
      throw new Error('Request body does not contain required fields');
    if (user.password !== updatePassword.oldPassword)
      throw new Error('Invalid old password');
    user.password = updatePassword.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    const { password, ...userToReturn } = user;
    return userToReturn;
  }

  delete(id: string): string {
    const userPos = this.users.findIndex((user) => user.id === id);
    if (userPos === -1) throw new Error('User not found');

    this.users.splice(userPos, 1);

    return `User with id ${id} successfully deleted`;
  }
}
