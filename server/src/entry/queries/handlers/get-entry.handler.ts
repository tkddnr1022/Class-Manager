import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEntryQuery } from '../impl/get-entry.query';
import { EntryService } from 'src/entry/entry.service';

@QueryHandler(GetEntryQuery)
export class GetEntryHandler implements IQueryHandler<GetEntryQuery> {
    constructor(private readonly entryService: EntryService) { }

    async execute(query: GetEntryQuery): Promise<any> {
        return this.entryService.getEntryById(query.entryId);
    }
}
