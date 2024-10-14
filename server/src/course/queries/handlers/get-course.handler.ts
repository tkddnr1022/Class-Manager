import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseQuery } from '../impl/get-course.query';
import { CourseService } from 'src/course/course.service';

@QueryHandler(GetCourseQuery)
export class GetCourseHandler implements IQueryHandler<GetCourseQuery> {
    constructor(private readonly courseService: CourseService) { }

    async execute(query: GetCourseQuery): Promise<any> {
        return this.courseService.getCourseById(query.courseId);
    }
}
