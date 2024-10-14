import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListEntriesQuery } from '../impl/list-entries.query';
import { EntryService } from 'src/entry/entry.service';

@QueryHandler(ListEntriesQuery)
export class ListEntriesHandler implements IQueryHandler<ListEntriesQuery> {
    constructor(private readonly entryService: EntryService) { }

    async execute(query: ListEntriesQuery): Promise<any> {
        return this.entryService.listEntries();
    }
}
