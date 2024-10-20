import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from 'src/user/user.service';
import { GetUserByOIdQuery } from '../impl/get-user-by-oid';

@QueryHandler(GetUserByOIdQuery)
export class GetUserByOIdHandler implements IQueryHandler<GetUserByOIdQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: GetUserByOIdQuery): Promise<any> {
        return this.userService.getUserByOId(query.oId);
    }
}
