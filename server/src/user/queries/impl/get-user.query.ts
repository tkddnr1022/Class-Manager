import { Types } from "mongoose";

export class GetUserQuery {
    constructor(public readonly userId: Types.ObjectId) { }
}