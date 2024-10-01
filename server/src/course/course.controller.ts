import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseDto } from './dtos/create-course.dto';
import { Course } from './models/course.model';
import { CreateCourseCommand } from './commands/impl/create-course.command';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { UpdateCourseCommand } from './commands/impl/update-course.command';
import { GetCourseQuery } from './queries/impl/get-course.query';
import { ListCoursesQuery } from './queries/impl/list-courses.query';
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
    async createCourse(@Request() req, @Body() createCourseDto: CreateCourseDto): Promise<Course> {
        const { title, startAt, endAt, location } = createCourseDto;
        const command = new CreateCourseCommand(req.user._id, title, startAt, endAt, location);
        return await this.commandBus.execute(command);
    }

    @Put(':courseId')
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateCourse(
        @Param('courseId') courseId: Types.ObjectId,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const { title, startAt, endAt, location } = updateCourseDto;
        const command = new UpdateCourseCommand(courseId, title, startAt, endAt, location);
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
