import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EntryCreatedEvent } from '../impl/entry-created.event';

@EventsHandler(EntryCreatedEvent)
export class EntryCreatedHandler implements IEventHandler<EntryCreatedEvent> {
    handle(event: EntryCreatedEvent) {
        console.log(`user ${event.userId} joined course ${event.courseId}`);
    }
}
