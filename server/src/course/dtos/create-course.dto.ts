import { IsDateString, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDateString()
    @IsNotEmpty()
    readonly startAt: Date;

    @IsDateString()
    @IsNotEmpty()
    readonly endAt: Date;

    @IsNotEmptyObject()
    readonly location: Coordinate;
}
