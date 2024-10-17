import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UnauthorizedException,
    UseGuards,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserDTO } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Post("/login")
    async login(@Body() authDto: AuthDTO, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.findOne(authDto.email)
        const isMatch = await bcrypt.compare(authDto.password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException()
        }

        this.authService.cookieGeneration(response, user._id)

        const { password, ...userWithoutPassword } = user;

        return { error: null, data: userWithoutPassword }
    }

    @Post("/register")
    async register(@Body() newUserDto: UserDTO, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.createUser(newUserDto)

        this.authService.cookieGeneration(response, user._id)

        const { password, ...userWithoutPassword } = user;

        return { error: null, data: userWithoutPassword }
    }
}