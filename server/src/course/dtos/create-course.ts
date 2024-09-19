import { Types } from "mongoose";

export class CreateCourseDto {
    readonly createdBy: Types.ObjectId;
    readonly title: string;
    readonly startAt: Date;
    readonly endAt: Date;
    readonly location: string;
}
