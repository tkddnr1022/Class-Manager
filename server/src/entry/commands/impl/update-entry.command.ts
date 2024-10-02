import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryCommand {
    constructor(
        public readonly entryId: Types.ObjectId,
        public readonly userId?: Types.ObjectId,
        public readonly courseId?: Types.ObjectId,
        public readonly location?: Coordinate,
        public readonly deviceId?: string,
        public readonly entryTime?: Date,
    ) { }
}