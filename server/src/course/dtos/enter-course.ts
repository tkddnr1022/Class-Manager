import { Types } from "mongoose";
import Coordinate from "../interfaces/coordinate.interface";

export class EnterCourseDto{
    readonly courseId: Types.ObjectId;
    readonly userId: Types.ObjectId;
    readonly location: Coordinate;
    readonly deviceId: string;
}