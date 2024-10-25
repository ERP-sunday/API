import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { User } from 'src/modules/user/models/user.model';
import { UserUpdateDTO } from 'src/modules/user/dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  updateUser = async (
    userId: string,
    parameters: UserUpdateDTO,
  ): Promise<User> => {
    const isUpdate = await this.userRepository.updateOneBy(
      { _id: userId },
      parameters,
    );

    if (!isUpdate) {
      throw new BadRequestException('Failed to update document');
    }

    return await this.userRepository.findOneById(userId);
  };
}
