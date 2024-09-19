import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CourseService } from 'src/course/course.service';
import { ListCoursesQuery } from '../impl/list-courses.query';

@QueryHandler(ListCoursesQuery)
export class ListCoursesHandler implements IQueryHandler<ListCoursesQuery> {
    constructor(private readonly courseService: CourseService) { }

    async execute(query: ListCoursesQuery): Promise<any> {
        return this.courseService.listCourses();
    }
}
