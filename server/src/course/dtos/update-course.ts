import Coordinate from "../interfaces/coordinate.interface";

export class UpdateCourseDto {
    public readonly title?: string;
    public readonly startAt?: Date;
    public readonly endAt?: Date;
    public readonly location?: Coordinate;
}
