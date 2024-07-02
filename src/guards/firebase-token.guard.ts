import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import app from 'src/configs/firebase.config';
import { UserRepository } from 'src/mongo/repositories/user.repository';

@Injectable()
export class FirebaseTokenGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace(/^Bearer\s/, '');

    try {
      const decodedToken = await app.auth().verifyIdToken(token, true);
      request.firebaseUser = await app.auth().getUser(decodedToken.uid);
      request.user = await this.userRepository.findOneBy({
        firebaseId: request.firebaseUser.uid,
      });

      return true;
    } catch {
      return false;
    }
  }
}
