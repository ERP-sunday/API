import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseTokenGuard } from 'src/guards/firebase-token.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/dto/user.dto';
import { CurrentUserGuard } from 'src/guards/current-user.guard';
import { UserUpdateDTO } from 'src/dto/user.update.dto';
  
  @Controller('users')
  @ApiTags('Users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: UserDTO) {
      const response = await this.userService.registerUser(body);

      return { error: "", data: response }
    }
  
    @Get('me')
    @UseGuards(FirebaseTokenGuard)
    @ApiSecurity('Bearer')
    @HttpCode(HttpStatus.OK)
    async getMe(@Req() request) {
      const response = request.user;

      return { error: "", data: response }
    }
  
    @Patch(':userId')
    @UseGuards(FirebaseTokenGuard)
    @ApiSecurity('Bearer')
    @HttpCode(HttpStatus.OK)
    updateUser(@Body() body: UserUpdateDTO, @Param('userId') userId: string) {
      const response = this.userService.updateUser(userId, body);

      return { error: "", data: response }
    }
  }