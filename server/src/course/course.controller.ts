import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseDto } from './dtos/create-course.dto';
import { Course } from './models/course.model';
import { CreateCourseCommand } from './commands/impl/create-course.command';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { UpdateCourseCommand } from './commands/impl/update-course.command';
import { GetCourseQuery } from './queries/impl/get-course.query';
import { ListCoursesQuery } from './queries/impl/list-courses.query';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { GetCourseByUserQuery } from './queries/impl/get-course-by-user.query';
import { OwnerGuard } from 'src/auth/guard/owner.guard';
import { DeleteCourseCommand } from './commands/impl/delete-course.command';
import { VerificationGuard } from 'src/auth/guard/verification.guard';

@ApiTags('강의')
@Controller('course')
export class CourseController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @ApiOperation({ summary: '강의 생성' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateCourseDto, description: '강의 데이터' })
    @ApiResponse({ status: 201, description: '강의 생성 성공', type: Course })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard, VerificationGuard)
    @Post()
    async createCourse(@Request() req, @Body() createCourseDto: CreateCourseDto): Promise<Course> {
        const { title, startAt, endAt, location } = createCourseDto;
        const command = new CreateCourseCommand(req.user._id, title, startAt, endAt, location);
        return await this.commandBus.execute(command);
    }

    @ApiOperation({ summary: '강의 수정' })
    @ApiBearerAuth()
    @ApiParam({ name: 'courseId', description: '수정할 강의 ID' })
    @ApiBody({ type: UpdateCourseDto, description: '수정된 강의 데이터' })
    @ApiResponse({ status: 200, description: '강의 수정 성공', type: Course })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '강의 찾을 수 없음' })
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard, OwnerGuard, VerificationGuard)
    @Put(':courseId')
    async updateCourse(
        @Param('courseId') courseId: string,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const { title, startAt, endAt, location } = updateCourseDto;
        const command = new UpdateCourseCommand(courseId, title, startAt, endAt, location);
        return await this.commandBus.execute(command);
    }

    @ApiOperation({ summary: '강의 상세 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'courseId', description: '조회할 강의 ID' })
    @ApiResponse({ status: 200, description: '강의 조회 성공', type: Course })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '강의 찾을 수 없음' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @Get(':courseId')
    async getCourse(@Param('courseId') courseId: string): Promise<Course> {
        const query = new GetCourseQuery(courseId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '특정 사용자의 강의 목록 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', description: '조회할 사용자 ID' })
    @ApiResponse({ status: 200, description: '강의 목록 조회 성공', type: [Course] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard, VerificationGuard)
    @Get('user/:userId')
    async getCourseByUserId(@Param('userId') userId: string): Promise<Course[]> {
        const query = new GetCourseByUserQuery(userId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '강의 목록 조회' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: '강의 목록 조회 성공', type: [Course] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard, VerificationGuard)
    @Get()
    async listCourses(): Promise<Course[]> {
        const query = new ListCoursesQuery();
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '강의 삭제' })
    @ApiBearerAuth()
    @ApiParam({ name: 'courseId', description: '삭제할 강의 ID' })
    @ApiResponse({ status: 200, description: '강의 삭제 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '강의 찾을 수 없음' })
    @Roles(Role.Admin, Role.Professor)
    @UseGuards(JwtAuthGuard, RolesGuard, OwnerGuard, VerificationGuard)
    @Delete(':courseId')
    async deleteCourse(@Param('courseId') courseId: string): Promise<void> {
        const command = new DeleteCourseCommand(courseId);
        return await this.commandBus.execute(command);
    }

}
