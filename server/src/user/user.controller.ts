import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { ListUsersQuery } from './queries/impl/list-users.query';
import { User } from './models/user.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GetUserByEmailQuery } from './queries/impl/get-user-by-email.query';
import { CheckEmailResponseDto } from './dtos/check-email-response.dto';

@ApiTags('사용자')
@Controller('user')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @ApiOperation({ summary: '사용자 생성' })
    @ApiBody({ type: CreateUserDto, description: '사용자 생성 데이터' })
    @ApiResponse({ status: 201, description: '사용자 생성 성공', type: User })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password, studentId } = createUserDto;
        const command = new CreateUserCommand(username, email, password, studentId);
        return await this.commandBus.execute(command);
    }

    @ApiOperation({ summary: '사용자 정보 수정' })
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', description: '수정할 사용자 ID' })
    @ApiBody({ type: UpdateUserDto, description: '수정된 사용자 데이터' })
    @ApiResponse({ status: 200, description: '사용자 수정 성공', type: User })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '사용자 찾을 수 없음' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const { username, email } = updateUserDto;
        const command = new UpdateUserCommand(userId, username, email);
        return await this.commandBus.execute(command);
    }

    @Get('check-email')
    @ApiOperation({ summary: '이메일 중복 검사' })
    @ApiQuery({ name: 'email', description: '중복 체크할 이메일', required: true })
    @ApiResponse({ status: 200, description: '이메일 사용 가능 여부 반환', type: CheckEmailResponseDto })
    async checkEmail(@Query('email') email: string): Promise<CheckEmailResponseDto> {
        const query = new GetUserByEmailQuery(email);
        const user = await this.queryBus.execute(query);
        return { isEmailTaken: !!user };
    }

    @ApiOperation({ summary: '특정 사용자 조회' })
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', description: '조회할 사용자 ID' })
    @ApiResponse({ status: 200, description: '사용자 조회 성공', type: User })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 404, description: '사용자 찾을 수 없음' })
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':userId')
    async getUser(@Param('userId') userId: string): Promise<User> {
        const query = new GetUserQuery(userId);
        return await this.queryBus.execute(query);
    }

    @ApiOperation({ summary: '사용자 목록 조회' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: '사용자 목록 조회 성공', type: [User] })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async listUsers(): Promise<User[]> {
        const query = new ListUsersQuery();
        return await this.queryBus.execute(query);
    }
}
