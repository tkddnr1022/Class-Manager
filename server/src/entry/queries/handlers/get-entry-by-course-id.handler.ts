import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntryService } from 'src/entry/entry.service';
import { GetEntryByCourseIdQuery } from '../impl/get-entry-by-course-id.query';

@QueryHandler(GetEntryByCourseIdQuery)
export class GetEntryByCourseIdHandler implements IQueryHandler<GetEntryByCourseIdQuery> {
    constructor(private readonly entryService: EntryService) { }

    async execute(query: GetEntryByCourseIdQuery): Promise<any> {
        return this.entryService.getEntryByCourseId(query.courseId);
    }
}
