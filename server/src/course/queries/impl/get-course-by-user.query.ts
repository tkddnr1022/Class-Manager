import { Types } from "mongoose";

export class GetCourseByUserQuery{
    constructor(
        public readonly userId: Types.ObjectId,
    ) {}
}