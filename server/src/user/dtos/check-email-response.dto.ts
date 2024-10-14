import { ApiResponseProperty } from "@nestjs/swagger";

export class CheckEmailResponseDto {
    @ApiResponseProperty()
    isEmailTaken: boolean;
}