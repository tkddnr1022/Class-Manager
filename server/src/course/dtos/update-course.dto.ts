import { IsDate, IsObject, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";

export class UpdateCourseDto {
    @IsString()
    public readonly title?: string;

    @IsDate()
    public readonly startAt?: Date;

    @IsDate()
    public readonly endAt?: Date;

    @IsObject()
    public readonly location?: Coordinate;
}
