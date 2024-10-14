import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CourseCreatedEvent } from '../impl/course-created.event';

@EventsHandler(CourseCreatedEvent)
export class CourseCreatedHandler implements IEventHandler<CourseCreatedEvent> {
    handle(event: CourseCreatedEvent) {
        console.log('Course created with ID:', event.courseId);
    }
}
