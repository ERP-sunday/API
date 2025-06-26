import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginDTO } from 'src/modules/auth/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/user/models/user.model';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { RegisterDTO } from '../dto/register.dto';
import { RefreshJwtDTO } from '../dto/refresh.jwt.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginDTO) {
    const user = await this.authService.findOne(loginUserDto.email);
    const isMatch =
      user && (await bcrypt.compare(loginUserDto.password, user.password));

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateJwt((user as any)._id.toString()),
      this.authService.generateRefreshToken((user as any)._id.toString()),
    ]);

    const isUpdated = await this.authService.updateRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );
    if (!isUpdated) {
      throw new InternalServerErrorException('Failed to update refresh token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken: _, ...safeUser } = user;
    return {
      error: null,
      data: safeUser,
      token: { accessToken, refreshToken },
    };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterDTO) {
    const user = await this.authService.createUser(registerUserDto);

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateJwt((user as any)._id.toString()),
      this.authService.generateRefreshToken((user as any)._id.toString()),
    ]);

    const isUpdated = await this.authService.updateRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );
    if (!isUpdated) {
      throw new InternalServerErrorException('Failed to update refresh token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken: _, ...safeUser } = user;
    return {
      error: null,
      data: safeUser,
      token: { accessToken, refreshToken },
    };
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshJwtDTO) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const payload = await this.authService.verifyRefreshToken(refreshToken);
    const user = await this.authService.findOneById(payload.sub);

    if (!user?.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.authService.generateJwt(
      (user as any)._id.toString(),
    );
    return {
      error: null,
      data: null,
      token: { accessToken },
    };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@UserDecorator() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...safeUser } = user;
    return {
      error: null,
      data: safeUser,
    };
  }
}
