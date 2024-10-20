import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class KakaoAuthDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    error?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    error_description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;
}