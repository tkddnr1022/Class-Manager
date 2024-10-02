import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { CreateEntryHandler } from './commands/handlers/create-entry.handler';
import { UpdateEntryHandler } from './commands/handlers/update-entry.handler';
import { GetEntryHandler } from './queries/handlers/get-entry.handler';
import { EntryCreatedHandler } from './events/handlers/entry-created.handler';
import { EntryUpdatedHandler } from './events/handlers/entry-updated.handler';
import { EntryRepository } from './repositories/entry.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrySchema } from './models/entry.model';
import { GetEntryByUserIdHandler } from './queries/handlers/get-entry-by-user-id.handler';
import { GetEntryByCourseIdHandler } from './queries/handlers/get-entry-by-course-id.handler';
import { ListEntriesHandler } from './queries/handlers/list-entries.handler';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'Entry', schema: EntrySchema }]),
  ],
  providers: [
    EntryService,
    EntryRepository,
    CreateEntryHandler,
    UpdateEntryHandler,
    GetEntryHandler,
    GetEntryByUserIdHandler,
    GetEntryByCourseIdHandler,
    ListEntriesHandler,
    EntryCreatedHandler,
    EntryUpdatedHandler,
  ],
  controllers: [EntryController]
})
export class EntryModule {}
