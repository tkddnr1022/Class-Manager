import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsObject, IsOptional, IsString } from "class-validator";
import Coordinate from "src/course/interfaces/coordinate.interface";

export class UpdateEntryDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  readonly courseId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  readonly userId?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly entryTime?: Date;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  readonly location?: Coordinate;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly deviceId?: string;
}
