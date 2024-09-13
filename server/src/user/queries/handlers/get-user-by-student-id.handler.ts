import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from 'src/user/user.service';
import { GetUserByStudentIdQuery } from '../impl/get-user-by-student-Id.query';

@QueryHandler(GetUserByStudentIdQuery)
export class GetUserByStudentHandler implements IQueryHandler<GetUserByStudentIdQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: GetUserByStudentIdQuery): Promise<any> {
        return this.userService.getUserByStudentId(query.studentId);
    }
}
