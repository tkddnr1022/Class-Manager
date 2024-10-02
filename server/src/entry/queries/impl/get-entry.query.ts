import { Types } from "mongoose";

export class GetEntryQuery {
    constructor(public readonly entryId: Types.ObjectId) { }
}