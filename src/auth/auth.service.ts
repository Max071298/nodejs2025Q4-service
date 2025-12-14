import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  async signIn(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    const user = await this.usersService.findOneByLogin(login);

    if (user.password !== password)
      throw new NotFoundException('Incorrect password');
  }
}
