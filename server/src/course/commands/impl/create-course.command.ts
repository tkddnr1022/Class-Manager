import { Types } from "mongoose";

export class CreateCourseCommand {
    constructor(
        public readonly createdBy: Types.ObjectId,
        public readonly title: string,
        public readonly startAt: Date,
        public readonly endAt: Date,
        public readonly location: string,
    ) { }
}