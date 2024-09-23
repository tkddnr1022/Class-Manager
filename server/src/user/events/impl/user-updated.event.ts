import { Types } from "mongoose";

export class UserUpdatedEvent {
    constructor(
        public readonly userId: Types.ObjectId,
        public readonly username: string,
    ) { }
}
