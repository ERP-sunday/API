import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginDto, RegisterDto } from 'src/modules/auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/modules/user/models/user.model';

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
  async login(
    @Body() loginUserDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: User = await this.authService.findOne(loginUserDto.email);
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.authService.cookieGeneration(response, user._id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { error: null, data: userWithoutPassword };
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
  async register(
    @Body() registerUserDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.createUser(registerUserDto);

    await this.authService.cookieGeneration(response, user._id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { error: null, data: userWithoutPassword };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/validate-cookie')
  @ApiOperation({ summary: 'Cookie validation' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cookie is valid' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired cookie',
  })
  async validateCookie() {
    return { valid: true };
  }
}
