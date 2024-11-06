import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class VerificationGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return user.verified;
    }
}
