import { Types } from "mongoose";

export class CourseCreatedEvent {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly title: string,
    ) { }
}
