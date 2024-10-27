import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserService } from "src/user/user.service";
import { UserCreatedEvent } from "src/user/events/impl/user-created.event";
import { CreateOAuthCommand } from "../impl/create-oauth.command";

@CommandHandler(CreateOAuthCommand)
export class CreateOAuthHandler implements ICommandHandler<CreateOAuthCommand>{
    constructor(
        private readonly userService: UserService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: CreateOAuthCommand): Promise<any> {
        const userData = await this.userService.createOAuth(command);
        this.eventBus.publish(new UserCreatedEvent(userData._id.toString(), userData.oId));
        return userData;
    }
}