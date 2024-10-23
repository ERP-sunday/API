import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/mongo/repositories/user.repository';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/mongo/models/user.model';
import config from 'src/configs/config';
import axios from 'axios';
import { UserUpdateDTO } from 'src/dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  updateUser = async (
    userId: string,
    parameters: UserUpdateDTO,
  ): Promise<User> => {
    // @ts-expect-error parameters is a DataType
    return this.userRepository.updateOneBy({ _id: userId }, parameters);
  };
}
