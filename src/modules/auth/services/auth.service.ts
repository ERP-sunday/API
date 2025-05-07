import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RegisterDto } from 'src/modules/auth/dto/auth.dto';
import config from 'src/configs/config';
import { BaseService } from '../../../common/services/base.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
      private readonly userRepository: UserRepository,
      private readonly jwtService: JwtService,
  ) {
    super();
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return this.assertFound(user, `User with email ${email} not found`) as User;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(userId);
      return this.assertFound(user, `User with ID ${userId} not found`) as User;
    } catch (error) {
      this.handleError(error);
    }
  }

  async generateRefreshToken(userId: string): Promise<string> {
    try {
      const payload = { sub: userId };
      return await this.jwtService.signAsync(payload, {
        secret: config().jwtRefreshToken,
        expiresIn: config().refreshJwtExpiration,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async generateJwt(userId: string): Promise<string> {
    try {
      const payload = { sub: userId };
      return await this.jwtService.signAsync(payload, {
        expiresIn: config().jwtExpiration,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    try {
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      return await this.userRepository.updateOneBy(
          { _id: userId },
          { refreshToken: hashedToken },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: config().jwtRefreshToken,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async createUser(parameters: RegisterDto): Promise<User> {
    try {
      const { email, password, firstname, lastname } = parameters;

      const existingUser = await this.userRepository.findOptionalBy({ email });
      if (existingUser) throw new ConflictException('User already exists');

      const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());

      const createdUser = await this.userRepository.insert({
        email,
        firstname,
        lastname,
        password: hashPassword,
      }) as User;

      return await this.userRepository.findOneById(createdUser._id);
    } catch (error) {
      this.handleError(error);
    }
  }
}