import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SkipAuth } from './decorators/skipAuth.decorator';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @SkipAuth()
  @Post('login')
  async signIn(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signIn(createUserDto);
  }

  @SkipAuth()
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }
}
