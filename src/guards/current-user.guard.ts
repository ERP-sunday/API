import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
  
@Injectable()
export class CurrentUserGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.params.userId == request.user._id) {
        return true;
        }

        throw new UnauthorizedException();
    }
}