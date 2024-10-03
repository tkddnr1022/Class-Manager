import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    public readonly title?: string;

    @IsDateString()
    @IsOptional()
    public readonly startAt?: Date;

    @IsDateString()
    @IsOptional()
    public readonly endAt?: Date;

    @IsObject()
    @IsOptional()
    public readonly location?: Coordinate;
}
