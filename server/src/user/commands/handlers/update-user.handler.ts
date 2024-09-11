import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { UserService } from 'src/user/user.service';
import { UserUpdatedEvent } from 'src/user/events/impl/user-updated.event';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        private readonly userService: UserService,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: UpdateUserCommand): Promise<any> {
        const { userId, username, email, password, studentId } = command;
        const userData = await this.userService.updateUser(userId, { username, email, password, studentId });
        this.eventBus.publish(new UserUpdatedEvent(userData._id.toString(), userData.username));
        return userData;
    }
}
