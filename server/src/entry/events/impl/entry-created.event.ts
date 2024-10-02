import { Types } from "mongoose";

export class EntryCreatedEvent {
    constructor(
        public readonly userId: Types.ObjectId,
        public readonly courseId: Types.ObjectId,
    ) { }
}
