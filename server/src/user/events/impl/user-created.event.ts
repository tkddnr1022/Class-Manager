import { Types } from "mongoose";

export class UserCreatedEvent {
    constructor(
        public readonly userId: Types.ObjectId,
        public readonly username: string,
    ) { }
}
