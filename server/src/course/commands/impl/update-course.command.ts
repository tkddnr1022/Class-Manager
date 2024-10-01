import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateCourseCommand {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly title?: string,
        public readonly startAt?: Date,
        public readonly endAt?: Date,
        public readonly location?: Coordinate,
    ) { }
}