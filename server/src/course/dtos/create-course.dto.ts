import { IsDateString, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    readonly startAt: Date;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    readonly endAt: Date;

    @ApiProperty()
    @IsNotEmptyObject()
    readonly location: Coordinate;
}
