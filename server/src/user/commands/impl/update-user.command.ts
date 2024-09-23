import { Types } from "mongoose";

export class UpdateUserCommand {
    constructor(
        public readonly userId: Types.ObjectId,
        public readonly username?: string,
        public readonly email?: string,
        public readonly password?: string,
        public readonly studentId?: string,
    ) { }
}