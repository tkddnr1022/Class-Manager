import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateEntryCommand } from "../impl/create-entry.command";
import { EntryService } from "src/entry/entry.service";
import { EntryCreatedEvent } from "src/entry/events/impl/entry-created.event";

@CommandHandler(CreateEntryCommand)
export class CreateEntryHandler implements ICommandHandler<CreateEntryCommand> {
    constructor(
        private readonly entryService: EntryService,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: CreateEntryCommand): Promise<any> {
        const { userId, courseId, location, deviceId } = command;
        const entryData = await this.entryService.createEntry({ userId, courseId, location, deviceId });
        this.eventBus.publish(new EntryCreatedEvent(userId, courseId));
        return entryData;
    }
}