import { Types } from "mongoose";

export class CourseEnteredEvent {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly userId: Types.ObjectId,
    ) { }
}
