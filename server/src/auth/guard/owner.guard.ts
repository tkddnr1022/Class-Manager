import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../enums/roles.enum';
import { QueryBus } from '@nestjs/cqrs';
import { GetCourseQuery } from 'src/course/queries/impl/get-course.query';
import { Types } from 'mongoose';

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private readonly queryBus: QueryBus,
    ){ }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // 관리자일 경우 통과
        if (user.roles.includes(Role.Admin)) {
            return true;    
        }

        // 타인의 유저 정보 접근 방지
        if (request.params.userId && request.params.userId.toString() != user._id.toString()) {
            return false;   
        }
        
        // 타인의 수업 정보 접근 방지
        if(request.params.courseId){
            const query = new GetCourseQuery(request.params.courseId);
            const course = await this.queryBus.execute(query);
            return course && course.createdBy._id.toString() == user._id.toString();   
        }

        return true;
    }
}
