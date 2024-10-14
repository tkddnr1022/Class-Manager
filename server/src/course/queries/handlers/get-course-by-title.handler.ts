import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CourseService } from 'src/course/course.service';
import { GetCourseByTitleQuery } from '../impl/get-course-by-title.query';

@QueryHandler(GetCourseByTitleQuery)
export class GetCourseByTitleHandler implements IQueryHandler<GetCourseByTitleQuery> {
    constructor(private readonly courseService: CourseService) { }

    async execute(query: GetCourseByTitleQuery): Promise<any> {
        return this.courseService.getCourseByTitle(query.title);
    }
}
