import Coordinate from "../interfaces/coordinate.interface";

export class CreateCourseDto {
    readonly title: string;
    readonly startAt: Date;
    readonly endAt: Date;
    readonly location: Coordinate;
}
