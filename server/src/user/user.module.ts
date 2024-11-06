import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSchema } from './models/user.model';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { ListUsersHandler } from './queries/handlers/list-users.handler';
import { UserCreatedHandler } from './events/handlers/user-created.handler';
import { UserUpdatedHandler } from './events/handlers/user-updated.handler';
import { UserController } from './user.controller';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';
import { GetUserByStudentHandler } from './queries/handlers/get-user-by-student-id.handler';
import { CreateOAuthHandler } from './commands/handlers/create-oauth.handler';
import { GetUserByOIdHandler } from './queries/handlers/get-user-by-oid';
import { GetVerificationHandler } from './queries/handlers/get-verification.handler';

@Module({
    controllers: [
        UserController,
    ],
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        CqrsModule,
    ],
    providers: [
        UserService,
        UserRepository,
        CreateUserHandler,
        UpdateUserHandler,
        GetUserHandler,
        GetUserByEmailHandler,
        GetUserByStudentHandler,
        ListUsersHandler,
        UserCreatedHandler,
        UserUpdatedHandler,
        CreateOAuthHandler,
        GetUserByOIdHandler,
        GetVerificationHandler,
    ],
})
export class UserModule { }
