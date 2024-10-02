import { Types } from "mongoose";

export default class EntryFilter{
    readonly courseId: Types.ObjectId;
    readonly userId?: Types.ObjectId;
    readonly deviceId?: string;
}