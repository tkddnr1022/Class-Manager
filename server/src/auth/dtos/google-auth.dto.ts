import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GoogleAuthDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly scope?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly authuser?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly prompt?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly hd?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly error?: string;
}