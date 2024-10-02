import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateEntryCommand {
    constructor(
        public readonly userId: Types.ObjectId,
        public readonly courseId: Types.ObjectId,
        public readonly location: Coordinate,
        public readonly deviceId: string,
    ) { }
}