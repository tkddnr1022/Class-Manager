import { IsMongoId, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateEntryDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly courseId: string;

    @IsNotEmptyObject()
    readonly location: Coordinate;

    @IsString()
    @IsNotEmpty()
    readonly deviceId: string;
}
