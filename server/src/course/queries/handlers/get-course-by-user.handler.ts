import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CourseService } from 'src/course/course.service';
import { GetCourseByUserQuery } from '../impl/get-course-by-user.query';

@QueryHandler(GetCourseByUserQuery)
export class GetCourseByUserHandler implements IQueryHandler<GetCourseByUserQuery> {
    constructor(private readonly courseService: CourseService) { }

    async execute(query: GetCourseByUserQuery): Promise<any> {
        return this.courseService.getCourseByUser(query.userId);
    }
}
