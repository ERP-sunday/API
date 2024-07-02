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
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserDTO } from 'src/dto/user.dto';
import { UserUpdateDTO } from 'src/dto/user.update.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDTO,
  })
  @ApiBody({ type: UserDTO })
  async createUser(@Body() body: UserDTO) {
    const response = await this.userService.registerUser(body);

    return { error: '', data: response };
  }

  @Get('me')
  @UseGuards(FirebaseTokenGuard)
  @ApiSecurity('Bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'The current user information.',
    type: UserDTO,
  })
  async getMe(@Req() request) {
    const response = request.user;

    return { error: '', data: response };
  }

  @Patch(':userId')
  @UseGuards(FirebaseTokenGuard)
  @ApiSecurity('Bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserUpdateDTO,
  })
  @ApiBody({ type: UserUpdateDTO })
  @ApiParam({ name: 'userId', description: 'The ID of the user to update' })
  async updateUser(
    @Body() body: UserUpdateDTO,
    @Param('userId') userId: string,
  ) {
    const response = await this.userService.updateUser(userId, body);

    return { error: '', data: response };
  }
}
