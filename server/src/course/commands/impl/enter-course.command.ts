import { Types } from "mongoose";

export class EnterCourseCommand {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly userId: Types.ObjectId,
        public readonly deviceId: string,
        public readonly location: string,
    ) { }
}