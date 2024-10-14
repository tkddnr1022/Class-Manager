import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntryService } from 'src/entry/entry.service';
import { GetEntryByUserIdQuery } from '../impl/get-entry-by-user-id.query';

@QueryHandler(GetEntryByUserIdQuery)
export class GetEntryByUserIdHandler implements IQueryHandler<GetEntryByUserIdQuery> {
    constructor(private readonly entryService: EntryService) { }

    async execute(query: GetEntryByUserIdQuery): Promise<any> {
        return this.entryService.getEntryByUserId(query.userId);
    }
}
