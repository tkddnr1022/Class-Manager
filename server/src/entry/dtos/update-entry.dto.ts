import { IsDateString, IsMongoId, IsObject, IsString } from "class-validator";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryDto {
  @IsMongoId()
  readonly courseId?: string;

  @IsMongoId()
  readonly userId?: string;

  @IsDateString()
  readonly entryTime?: Date;

  @IsObject()
  readonly location?: Coordinate;

  @IsString()
  readonly deviceId?: string;
}
