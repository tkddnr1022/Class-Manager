import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly password?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly studentId?: string;
}
