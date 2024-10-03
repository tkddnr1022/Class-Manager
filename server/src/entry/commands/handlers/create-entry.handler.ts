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
        const entryData = await this.entryService.createEntry(command);
        this.eventBus.publish(new EntryCreatedEvent(entryData.userId.toString(), entryData.courseId.toString()));
        return entryData;
    }
}