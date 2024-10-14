import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EntryUpdatedEvent } from '../impl/entry-updated.event';

@EventsHandler(EntryUpdatedEvent)
export class EntryUpdatedHandler implements IEventHandler<EntryUpdatedEvent> {
  handle(event: EntryUpdatedEvent) {
    console.log('Entry updated with ID:', event.entryId);
  }
}
