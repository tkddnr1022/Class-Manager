import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('course')
export class CourseController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
        const { createdBy, title, startAt, endAt, location } = createCourseDto;
        const command = new CreateCourseCommand(createdBy, title, startAt, endAt, location);
        return await this.commandBus.execute(command);
    }

    @Post('enter')
    @UseGuards(JwtAuthGuard)
    async enterCourse(@Body() enterCourseDto: EnterCourseDto): Promise<Course> {
        const { courseId, userId, deviceId, location } = enterCourseDto;
        const command = new EnterCourseCommand(courseId, userId, deviceId, location);
        return await this.commandBus.execute(command);
    }

    @Put(':courseId')
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateCourse(
        @Param('courseId') courseId: Types.ObjectId,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const { title, startAt, endAt, location, students } = updateCourseDto;
        const command = new UpdateCourseCommand(courseId, title, startAt, endAt, location, students);
        return await this.commandBus.execute(command);
    }

    @Get(':courseId')
    @UseGuards(JwtAuthGuard)
    async getCourse(@Param('courseId') courseId: Types.ObjectId): Promise<Course> {
        const query = new GetCourseQuery(courseId);
        return await this.queryBus.execute(query);
    }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async listCourses(): Promise<Course[]> {
        const query = new ListCoursesQuery();
        return await this.queryBus.execute(query);
    }
}
