import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CourseDeletedEvent } from '../impl/course-deleted.event';

@EventsHandler(CourseDeletedEvent)
export class CourseDeletedHandler implements IEventHandler<CourseDeletedEvent> {
    handle(event: CourseDeletedEvent) {
        console.log('Course deleted with ID:', event.courseId);
    }
}
