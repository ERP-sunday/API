import { Controller } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}
}
