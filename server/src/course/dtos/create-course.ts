import { Types } from "mongoose";
import Coordinate from "../interfaces/coordinate.interface";

export class CreateCourseDto {
    readonly createdBy: Types.ObjectId;
    readonly title: string;
    readonly startAt: Date;
    readonly endAt: Date;
    readonly location: Coordinate;
}
