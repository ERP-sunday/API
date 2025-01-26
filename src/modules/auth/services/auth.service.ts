import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RegisterDto } from 'src/modules/auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import config from 'src/configs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<User> {
    const response = await this.userRepository.findOneBy({
      email: email,
    });

    if (!response) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return response as User;
  }

  async findOneById(userId): Promise<User> {
    const response = await this.userRepository.findOneById(userId);

    if (!response) {
      throw new NotFoundException(`User with _id ${userId} not found`);
    }

    return response as User;
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      secret: config().jwtRefreshToken,
      expiresIn: '7d', // Durée de validité plus longue pour le refresh token
    });
  }

  async generateJwt(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: config().jwtExpiration,
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.updateOneBy(
      { _id: userId },
      { refreshToken: hashedToken },
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(refreshToken, {
        secret: config().jwtRefreshToken,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
