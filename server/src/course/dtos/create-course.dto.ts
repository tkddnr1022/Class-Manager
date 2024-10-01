import { IsDate, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDate()
    @IsNotEmpty()
    readonly startAt: Date;

    @IsDate()
    @IsNotEmpty()
    readonly endAt: Date;

    @IsNotEmptyObject()
    readonly location: Coordinate;
}
