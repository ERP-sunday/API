import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    const user = await this.authService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}