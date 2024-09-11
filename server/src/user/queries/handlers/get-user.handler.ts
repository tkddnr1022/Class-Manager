import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../impl/get-user.query';
import { UserService } from 'src/user/user.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: GetUserQuery): Promise<any> {
        return this.userService.getUserById(query.userId);
    }
}
