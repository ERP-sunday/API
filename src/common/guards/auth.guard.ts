import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse<Response>();
    const signedCookieValue = request.signedCookies['jwt'];

    if (!signedCookieValue) {
      return false;
    }

    const isUserExist =
      await this.authService.verifyIfUserIdExist(signedCookieValue);
    await this.authService.cookieGeneration(response, signedCookieValue);

    return isUserExist;
  }
}
