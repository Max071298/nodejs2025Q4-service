import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
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

  async signIn(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { login, password } = createUserDto;

    const user = await this.usersService.findOneByLogin(login);
    if (!user) throw new ForbiddenException('There is no user with such login');
    if (user.password !== password) {
      throw new ForbiddenException('Incorrect password');
    } else {
      const payload = { sub: user.id, username: user.login };
      return { access_token: await this.jwtService.signAsync(payload) };
    }
  }
}
