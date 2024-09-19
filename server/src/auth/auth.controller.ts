import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    async signIn(@Body() signInDto: SignInDto) {
        const user = await this.authService.validateUser(signInDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return await this.authService.signIn(user);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        return await this.authService.signIn(req.user);
    }
}
