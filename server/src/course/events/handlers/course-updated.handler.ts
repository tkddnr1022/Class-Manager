import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CourseUpdatedEvent } from '../impl/course-updated.event';

@EventsHandler(CourseUpdatedEvent)
export class CourseUpdatedHandler implements IEventHandler<CourseUpdatedEvent> {
    handle(event: CourseUpdatedEvent) {
        console.log('Course updated with ID:', event.courseId);
    }
}
