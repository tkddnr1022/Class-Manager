import { Types } from "mongoose";

export class GetEntryByCourseIdQuery {
    constructor(public readonly courseId: Types.ObjectId) { }
}