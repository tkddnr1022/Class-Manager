import { IsDateString, IsMongoId, IsObject, IsOptional, IsString } from "class-validator";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryDto {
  @IsMongoId()
  @IsOptional()
  readonly courseId?: string;

  @IsMongoId()
  @IsOptional()
  readonly userId?: string;

  @IsDateString()
  @IsOptional()
  readonly entryTime?: Date;

  @IsObject()
  @IsOptional()
  readonly location?: Coordinate;

  @IsString()
  @IsOptional()
  readonly deviceId?: string;
}
