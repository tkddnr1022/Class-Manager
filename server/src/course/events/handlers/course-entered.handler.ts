import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CourseEnteredEvent } from '../impl/course-entered.event';

@EventsHandler(CourseEnteredEvent)
export class CourseEnteredHandler implements IEventHandler<CourseEnteredEvent> {
    handle(event: CourseEnteredEvent) {
        console.log(event.userId, 'entered Course', event.courseId);
    }
}
