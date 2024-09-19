import { Types } from "mongoose";

export class UpdateCourseCommand {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly title?: string,
        public readonly startAt?: Date,
        public readonly endAt?: Date,
        public readonly location?: string,
        public readonly students?: { student: Types.ObjectId, joinedAt: Date, deviceId?: string }[],
    ) { }
}