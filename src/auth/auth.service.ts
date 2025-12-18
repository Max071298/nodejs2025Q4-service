import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async signIn(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = createUserDto;

    const user = await this.usersService.findOneByLogin(login);
    if (!user) throw new ForbiddenException('There is no user with such login');
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Incorrect password');
    } else {
      const payload = { sub: user.id, username: user.login };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
      });

      return { accessToken, refreshToken };
    }
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const oldRefreshToken = refreshTokenDto.refreshToken;

    if (!oldRefreshToken && typeof oldRefreshToken !== 'string')
      throw new UnauthorizedException('Invalid data');

    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      });

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
      });

      return { accessToken, refreshToken };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
