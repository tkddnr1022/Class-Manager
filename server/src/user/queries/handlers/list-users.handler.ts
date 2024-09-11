import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../impl/list-users.query';
import { UserService } from 'src/user/user.service';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: ListUsersQuery): Promise<any> {
        return this.userService.listUsers();
    }
}
