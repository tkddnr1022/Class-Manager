import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
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
import { Types } from 'mongoose';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password, studentId } = createUserDto;
        const command = new CreateUserCommand(username, email, password, studentId);
        return await this.commandBus.execute(command);
    }

    @Put(':userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateUser(
        @Param('userId') userId: Types.ObjectId,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const { username, email } = updateUserDto;
        const command = new UpdateUserCommand(userId, username, email);
        return await this.commandBus.execute(command);
    }

    @Get(':userId')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getUser(@Param('userId') userId: Types.ObjectId): Promise<User> {
        const query = new GetUserQuery(userId);
        return await this.queryBus.execute(query);
    }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async listUsers(): Promise<User[]> {
        const query = new ListUsersQuery();
        return await this.queryBus.execute(query);
    }
}
