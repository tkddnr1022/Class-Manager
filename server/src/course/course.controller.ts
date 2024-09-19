import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseDto } from './dtos/create-course';
import { Course } from './models/course.model';
import { CreateCourseCommand } from './commands/impl/create-course.command';
import { UpdateCourseDto } from './dtos/update-course';
import { UpdateCourseCommand } from './commands/impl/update-course.command';
import { GetCourseQuery } from './queries/impl/get-course.query';
import { ListCoursesQuery } from './queries/impl/list-courses.query';
import { EnterCourseDto } from './dtos/enter-course';
import { EnterCourseCommand } from './commands/impl/enter-course.command';
import { Types } from 'mongoose';

@Controller('course')
export class CourseController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    async createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
        const { createdBy, title, startAt, endAt, location } = createCourseDto;
        const command = new CreateCourseCommand(createdBy, title, startAt, endAt, location);
        return await this.commandBus.execute(command);
    }

    @Post('enter')
    async enterCourse(@Body() enterCourseDto: EnterCourseDto): Promise<Course> {
        const { courseId, userId, deviceId, location } = enterCourseDto;
        const command = new EnterCourseCommand(courseId, userId, deviceId, location);
        return await this.commandBus.execute(command);
    }

    @Put(':id')
    async updateCourse(
        @Param('id') id: Types.ObjectId,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const { title, startAt, endAt, location, students } = updateCourseDto;
        const command = new UpdateCourseCommand(id, title, startAt, endAt, location, students);
        return await this.commandBus.execute(command);
    }

    @Get(':id')
    async getCourse(@Param('id') id: Types.ObjectId): Promise<Course> {
        const query = new GetCourseQuery(id);
        return await this.queryBus.execute(query);
    }

    @Get()
    async listUsers(): Promise<Course[]> {
        const query = new ListCoursesQuery();
        return await this.queryBus.execute(query);
    }
}
