import { Types } from "mongoose";

export class Payload{
    sub: Types.ObjectId;
    username: string;
}