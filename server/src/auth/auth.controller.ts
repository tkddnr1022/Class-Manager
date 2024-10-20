import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Token } from './interfaces/token.interface';
import { User } from 'src/user/models/user.model';
import { KakaoAuthDto } from './dtos/kakao-auth.dto';
import { Response } from 'express';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: '사용자 로그인' })
    @ApiBody({ type: SignInDto, description: '사용자 로그인 정보' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공', type: Token })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    async signIn(@Body() signInDto: SignInDto): Promise<Token> {
        const user = await this.authService.validateUser(signInDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return await this.authService.signIn(user);
    }

    @ApiOperation({ summary: 'JWT 리프레시 토큰 갱신' })
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, description: '토큰 갱신 성공', type: Token })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '토큰 갱신 실패' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(@Request() req): Promise<Token> {
        return await this.authService.signIn(req.user);
    }

    @ApiOperation({ summary: '사용자 프로필 조회' })
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, description: '프로필 조회 성공', type: User })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req): Promise<User> {
        return req.user;
    }

    @Get('kakao')
    async kakaoAuth(@Query() kakaoAuthDto: KakaoAuthDto, @Res() res: Response) {
        if (!kakaoAuthDto.code) {
            throw new BadRequestException(kakaoAuthDto.error);
        }
        const token = await this.authService.kakaoAuth(kakaoAuthDto.code);
        res.redirect(`class-manager://login?access_token=${token.access_token}&refresh_token=${token.refresh_token}`);
    }
}
