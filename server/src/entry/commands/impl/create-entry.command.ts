import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateEntryCommand {
    constructor(
        public readonly userId: string,
        public readonly courseId: string,
        public readonly location: Coordinate,
        public readonly deviceId: string,
    ) { }
}