import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../impl/user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  handle(event: UserUpdatedEvent) {
    console.log('User updated with ID:', event.userId);
  }
}
