import { IsDate, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryDto {
  @IsString()
  readonly courseId?: Types.ObjectId;

  @IsString()
  readonly userId?: Types.ObjectId;

  @IsDate()
  readonly entryTime?: Date;

  @IsObject()
  readonly location?: Coordinate;

  @IsString()
  readonly deviceId?: string;
}
