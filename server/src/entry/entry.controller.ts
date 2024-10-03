import { GetEntryByCourseIdQuery } from './queries/impl/get-entry-by-course-id.query';
import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEntryDto } from './dtos/create-entry.dto';
import { Entry } from './models/entry.model';
import { CreateEntryCommand } from './commands/impl/create-entry.command';
import { UpdateEntryDto } from './dtos/update-entry.dto';
import { UpdateEntryCommand } from './commands/impl/update-entry.command';
import { GetEntryQuery } from './queries/impl/get-entry.query';
import { ListEntriesQuery } from './queries/impl/list-entries.query';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetEntryByUserIdQuery } from './queries/impl/get-entry-by-user-id.query';

@Controller('entry')
export class EntryController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createEntry(@Request() req, @Body() createEntryDto: CreateEntryDto): Promise<Entry> {
        const { courseId, location, deviceId } = createEntryDto;
        const command = new CreateEntryCommand(req.user._id, courseId, location, deviceId);
        return await this.commandBus.execute(command);
    }

    @Put(':entryId')
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateEntry(
        @Param('entryId') entryId: string,
        @Body() updateEntryDto: UpdateEntryDto,
    ): Promise<Entry> {
        const { courseId, userId, location, deviceId, entryTime } = updateEntryDto;
        const command = new UpdateEntryCommand(entryId, userId, courseId, location, deviceId, entryTime);
        return await this.commandBus.execute(command);
    }

    @Get(':entryId')
    @UseGuards(JwtAuthGuard)
    async getEntry(@Param('entryId') entryId: string): Promise<Entry> {
        const query = new GetEntryQuery(entryId);
        return await this.queryBus.execute(query);
    }

    @Get('course/:courseId')
    @UseGuards(JwtAuthGuard)
    async getEntryByCourseId(@Param('courseId') courseId: string): Promise<Entry[]>{
        const query = new GetEntryByCourseIdQuery(courseId);
        return await this.queryBus.execute(query);
    }

    // Todo: null return 현상 해결
    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getEntryByUserId(@Param('userId') userId: string): Promise<Entry[]>{
        const query = new GetEntryByUserIdQuery(userId);
        return await this.queryBus.execute(query);
    }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async listEntries(): Promise<Entry[]> {
        const query = new ListEntriesQuery();
        return await this.queryBus.execute(query);
    }
}
