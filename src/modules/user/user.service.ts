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
    // @ts-ignore
    return this.userRepository.updateOneBy({ _id: userId }, parameters);
  };

  registerUser = async (parameters: UserDTO): Promise<User> => {
    try {
      const { email, password, firstname, lastname } = parameters;
      const data = JSON.stringify({ email, password, returnSecureToken: true });
      
      const result = await axios({
        method: 'post',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config().apiKey}`,
        headers: { 'Content-Type': 'application/json' },
        data: data,
      });

      const { localId: firebaseId } = result.data;

      const savedUser = await this.userRepository.insert({
          email: email,
          firstname: firstname,
          lastname: lastname,
          firebaseId: firebaseId,
      }) as User

      return await this.userRepository.findOneById(savedUser._id)
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}