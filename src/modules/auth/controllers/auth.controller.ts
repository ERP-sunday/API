import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus, InternalServerErrorException,
  Post,
  UnauthorizedException, UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginDto, RefreshJWTDto, RegisterDto } from "src/modules/auth/dto/auth.dto";
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/user/models/user.model';
import {JwtAuthGuard} from "../../../common/guards/jwt.auth.guard";
import { User as UserDecorator } from 'src/common/decorators/user.decorator';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginUserDto: LoginDto) {
    const user: User = await this.authService.findOne(loginUserDto.email);
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const newAccessToken = await this.authService.generateJwt(user._id);
    const newRefreshToken = await this.authService.generateRefreshToken(
      user._id,
    );

    const isUpdate = await this.authService.updateRefreshToken(
      user._id,
      newRefreshToken,
    );

    if (!isUpdate) {
      throw new InternalServerErrorException('Failed to update refresh token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...userWithoutPassword } = user;
    return {
      error: null,
      data: userWithoutPassword,
      token: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration successful',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  async register(@Body() registerUserDto: RegisterDto) {
    const user = await this.authService.createUser(registerUserDto);

    const newAccessToken = await this.authService.generateJwt(user._id);
    const newRefreshToken = await this.authService.generateRefreshToken(
      user._id,
    );

    const isUpdate = await this.authService.updateRefreshToken(
      user._id,
      newRefreshToken,
    );

    if (!isUpdate) {
      throw new InternalServerErrorException('Failed to update refresh token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...userWithoutPassword } = user;
    return {
      error: null,
      data: userWithoutPassword,
      token: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  @Post('/refresh')
  async refresh(@Body() refreshJWTDto: RefreshJWTDto) {
    if (!refreshJWTDto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const payload = await this.authService.verifyRefreshToken(
      refreshJWTDto.refreshToken,
    );

    const user = await this.authService.findOneById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isTokenValid = await bcrypt.compare(
      refreshJWTDto.refreshToken,
      user.refreshToken,
    );
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = await this.authService.generateJwt(user._id);

    return {
      error: null,
      data: null,
      token: {
        accessToken: newAccessToken,
      },
    };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user info' })
  async getCurrentUser(@UserDecorator() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...userWithoutSensitiveInfo } = user;
    return {
      error: null,
      data: userWithoutSensitiveInfo,
    };
  }
}
