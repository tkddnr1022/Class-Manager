import { Types } from "mongoose";

export class EnterCourseDto{
    readonly courseId: Types.ObjectId;
    readonly userId: Types.ObjectId;
    readonly location: string;
    readonly deviceId: string;
}