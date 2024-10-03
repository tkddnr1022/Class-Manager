import { IsDateString, IsObject, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";

export class UpdateCourseDto {
    @IsString()
    public readonly title?: string;

    @IsDateString()
    public readonly startAt?: Date;

    @IsDateString()
    public readonly endAt?: Date;

    @IsObject()
    public readonly location?: Coordinate;
}
