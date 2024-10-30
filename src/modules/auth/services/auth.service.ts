import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { Response } from 'express';
import { RegisterDto } from 'src/modules/auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(email: string): Promise<User> {
    const response = await this.userRepository.findOneBy({
      email: email,
    });

    if (!response) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return response as User;
  }

  async verifyIfUserIdExist(userId: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneById(userId);

      if (!user) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async cookieGeneration(response: Response, userId: string) {
    response.cookie('jwt', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7200000, // Cookie valide pendant 2 heure,
      signed: true,
      sameSite: 'strict',
    });
  }

  async createUser(parameters: RegisterDto): Promise<User> {
    try {
      const { email, password, firstname, lastname } = parameters;

      const genSalt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, genSalt);

      const savedUser = (await this.userRepository.insert({
        email: email,
        firstname: firstname,
        password: hashPassword,
        lastname: lastname,
      })) as User;

      return await this.userRepository.findOneById(savedUser._id);
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
