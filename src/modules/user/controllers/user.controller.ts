import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserDTO } from 'src/common/dto/user.dto';
import { UserUpdateDTO } from 'src/common/dto/user.update.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards()
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
  @UseGuards()
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
