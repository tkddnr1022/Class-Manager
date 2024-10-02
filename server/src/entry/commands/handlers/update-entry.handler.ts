import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEntryCommand } from '../impl/update-entry.command';
import { EntryService } from 'src/entry/entry.service';
import { EntryUpdatedEvent } from 'src/entry/events/impl/entry-updated.event';

@CommandHandler(UpdateEntryCommand)
export class UpdateEntryHandler implements ICommandHandler<UpdateEntryCommand> {
    constructor(
        private readonly entryService: EntryService,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: UpdateEntryCommand): Promise<any> {
        const entryData = await this.entryService.updateEntry(command);
        this.eventBus.publish(new EntryUpdatedEvent(entryData._id));
        return entryData;
    }
}
