import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthDTO } from 'src/common/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserDTO } from 'src/common/dto/user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/modules/user/models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() authDto: AuthDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: User = await this.authService.findOne(authDto.email);
    const isMatch = await bcrypt.compare(authDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.authService.cookieGeneration(response, user._id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { error: null, data: userWithoutPassword };
  }

  @Post('/register')
  async register(
    @Body() newUserDto: UserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.createUser(newUserDto);

    await this.authService.cookieGeneration(response, user._id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { error: null, data: userWithoutPassword };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('/validate-cookie')
  async validateCookie() {
    return { valid: true };
  }
}
