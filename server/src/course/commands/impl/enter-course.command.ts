import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class EnterCourseCommand {
    constructor(
        public readonly courseId: Types.ObjectId,
        public readonly userId: Types.ObjectId,
        public readonly deviceId: string,
        public readonly location: Coordinate,
    ) { }
}