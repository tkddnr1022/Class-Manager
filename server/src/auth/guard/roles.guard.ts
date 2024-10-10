import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.roles.includes(Role.Admin)) {
            return true;    // 관리자일 경우 통과
        }
        if (request.params.userId && request.params.userId != user._id) {
            console.log(request.params.userId, user._id);
            return false;   // 관리자가 아닌 경우 타인의 유저 정보 접근 방지
        }
        // Todo: 수업 정보 Command 요청 시 userId 검사
        /*
        if(request.params.courseId && course.userId != user.userId){
            return false;   // 관리자가 아닌 경우 타인의 수업 정보 접근 방지
        }
        */
        if (!requiredRoles) {
            return true;    // 이외에 필요한 권한이 없을 경우 통과
        }

        return requiredRoles.some((role) => user.roles.includes(role));
    }
}
