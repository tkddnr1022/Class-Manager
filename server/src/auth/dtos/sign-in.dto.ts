import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}