import { Types } from "mongoose";

export class GetEntryByUserIdQuery {
    constructor(public readonly userId: Types.ObjectId) { }
}