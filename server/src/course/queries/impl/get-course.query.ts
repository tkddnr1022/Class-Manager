import { Types } from "mongoose";

export class GetCourseQuery{
    constructor(
        public readonly courseId: Types.ObjectId,
    ) {}
}