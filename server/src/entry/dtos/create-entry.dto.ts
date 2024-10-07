import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateEntryDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    readonly courseId: string;

    @ApiProperty()
    @IsNotEmptyObject()
    readonly location: Coordinate;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly deviceId: string;
}
