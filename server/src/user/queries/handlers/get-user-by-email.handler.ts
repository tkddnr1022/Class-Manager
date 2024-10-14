import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from 'src/user/user.service';
import { GetUserByEmailQuery } from '../impl/get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: GetUserByEmailQuery): Promise<any> {
        return this.userService.getUserByEmail(query.email);
    }
}
