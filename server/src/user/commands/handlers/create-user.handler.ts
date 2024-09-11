import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../impl/create-user.command";
import { UserService } from "src/user/user.service";
import { UserCreatedEvent } from "src/user/events/impl/user-created.event";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
    constructor(
        private readonly userService: UserService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: CreateUserCommand): Promise<any> {
        const { username, email, password, studentId } = command;
        const userData = await this.userService.createUser({username, email, password, studentId});
        this.eventBus.publish(new UserCreatedEvent(userData._id.toString(), userData.username));
        return userData;
    }
}