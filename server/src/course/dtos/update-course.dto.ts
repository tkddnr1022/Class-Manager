import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";
import Coordinate from "../interfaces/coordinate.interface";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    public readonly title?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    public readonly startAt?: Date;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    public readonly endAt?: Date;

    @ApiPropertyOptional()
    @IsObject()
    @IsOptional()
    public readonly location?: Coordinate;
}
