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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('출석 기록')
@Controller('entry')
export class EntryController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @ApiOperation({ summary: '출석 기록 생성' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateEntryDto, description: '출석 기록 데이터' })
    @ApiResponse({ status: 201, description: '출석 기록 생성 성공', type: Entry })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createEntry(@Request() req, @Body() createEntryDto: CreateEntryDto): Promise<Entry> {
        const { courseId, location, deviceId } = createEntryDto;
        const command = new CreateEntryCommand(req.user._id, courseId, location, deviceId);
        return await this.commandBus.execute(command);
    }

    @ApiOperation({ summary: '출석 기록 수정' })
    @ApiBearerAuth()
    @ApiParam({ name: 'entryId', description: '수정할 출석 기록 ID' })
    @ApiBody({ type: UpdateEntryDto, description: '수정된 출석 기록 데이터' })
    @ApiResponse({ status: 200, description: '출석 기록 수정 성공', type: Entry })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '출석 기록 찾을 수 없음' })
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':entryId')
    async updateEntry(
        @Param('entryId') entryId: string,
        @Body() updateEntryDto: UpdateEntryDto,
    ): Promise<Entry> {
        const { courseId, userId, location, deviceId, entryTime } = updateEntryDto;
        const command = new UpdateEntryCommand(entryId, userId, courseId, location, deviceId, entryTime);
        return await this.commandBus.execute(command);
    }

    @ApiOperation({ summary: '출석 기록 상세 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'entryId', description: '조회할 출석 기록 ID' })
    @ApiResponse({ status: 200, description: '출석 기록 조회 성공', type: Entry })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '출석 기록 찾을 수 없음' })
    @UseGuards(JwtAuthGuard)
    @Get(':entryId')
    async getEntry(@Param('entryId') entryId: string): Promise<Entry> {
        const query = new GetEntryQuery(entryId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '특정 강의의 출석 기록 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'courseId', description: '조회할 강의 ID' })
    @ApiResponse({ status: 200, description: '출석 기록 조회 성공', type: [Entry] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId')
    async getEntryByCourseId(@Param('courseId') courseId: string): Promise<Entry[]> {
        const query = new GetEntryByCourseIdQuery(courseId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '특정 사용자의 출석 기록 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', description: '조회할 사용자 ID' })
    @ApiResponse({ status: 200, description: '출석 기록 조회 성공', type: [Entry] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async getEntryByUserId(@Param('userId') userId: string): Promise<Entry[]> {
        const query = new GetEntryByUserIdQuery(userId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '출석 기록 목록 조회' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: '출석 기록 목록 조회 성공', type: [Entry] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async listEntries(): Promise<Entry[]> {
        const query = new ListEntriesQuery();
        return await this.queryBus.execute(query);
    }
}
