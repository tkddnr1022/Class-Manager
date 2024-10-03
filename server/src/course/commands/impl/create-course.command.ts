import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateCourseCommand {
    constructor(
        public readonly createdBy: string,
        public readonly title: string,
        public readonly startAt: Date,
        public readonly endAt: Date,
        public readonly location: Coordinate,
    ) { }
}