import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { ListUsersQuery } from './queries/impl/list-users.query';
import { User } from './models/user.model';

@Controller('user')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    // 유저 생성 (Command)
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password, studentId } = createUserDto;
        const command = new CreateUserCommand(username, email, password, studentId);
        return await this.commandBus.execute(command);
    }

    // 유저 정보 업데이트 (Command)
    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const { username, email } = updateUserDto;
        const command = new UpdateUserCommand(id, username, email);
        return await this.commandBus.execute(command);
    }

    // 특정 유저 조회 (Query)
    @Get(':id')
    async getUser(@Param('id') id: string): Promise<User> {
        const query = new GetUserQuery(id);
        return await this.queryBus.execute(query);
    }

    // 모든 유저 리스트 조회 (Query)
    @Get()
    async listUsers(): Promise<User[]> {
        const query = new ListUsersQuery();
        return await this.queryBus.execute(query);
    }
}
