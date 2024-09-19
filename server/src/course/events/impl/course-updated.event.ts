import { Types } from "mongoose";

export class CourseUpdatedEvent {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly title: string,
    ) { }
}
