import { Types } from "mongoose";

export class EntryUpdatedEvent {
    constructor(
        public readonly entryId: Types.ObjectId,
    ) { }
}
