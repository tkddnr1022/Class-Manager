import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryCommand {
    constructor(
        public readonly entryId: string,
        public readonly userId?: string,
        public readonly courseId?: string,
        public readonly location?: Coordinate,
        public readonly deviceId?: string,
        public readonly entryTime?: Date,
    ) { }
}