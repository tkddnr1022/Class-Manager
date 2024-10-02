import { IsMongoId, IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class CreateEntryDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly courseId: Types.ObjectId;

    @IsNotEmptyObject()
    readonly location: Coordinate;

    @IsString()
    @IsNotEmpty()
    readonly deviceId: string;
}
