import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVerificationQuery } from '../impl/get-verification.query';
import { UserService } from 'src/user/user.service';

@QueryHandler(GetVerificationQuery)
export class GetVerificationHandler implements IQueryHandler<GetVerificationQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: GetVerificationQuery): Promise<any> {
        return this.userService.getVerification(query.userId);
    }
}
