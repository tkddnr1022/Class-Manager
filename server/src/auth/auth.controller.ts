import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Token } from './interfaces/token.interface';
import { User } from 'src/user/models/user.model';
import { KakaoAuthDto } from './dtos/kakao-auth.dto';
import { Response } from 'express';
import { GoogleAuthDto } from './dtos/google-auth.dto';

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

    @ApiOperation({ summary: '카카오 인증' })
    @ApiResponse({ status: HttpStatus.FOUND, description: '카카오 로그인 페이지로 리다이렉트' })
    @Get('kakao')
    async kakaoAuth(@Res() res: Response) {
        res.redirect(this.authService.kakaoAuthURL());
    }

    @ApiOperation({ summary: '카카오 인증 콜백' })
    @ApiResponse({ status: HttpStatus.FOUND, description: '카카오 인증 성공 후 리다이렉트', type: Token })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
    @Get('kakao/callback')
    async kakaoAuthCallback(@Query() kakaoAuthDto: KakaoAuthDto, @Res() res: Response) {
        if (!kakaoAuthDto.code) {
            throw new BadRequestException(kakaoAuthDto.error);
        }
        const token = await this.authService.kakaoAuthCallback(kakaoAuthDto.code);
        res.redirect(`class-manager://login?access_token=${token.access_token}&refresh_token=${token.refresh_token}`);
    }

    @ApiOperation({ summary: '구글 인증' })
    @ApiResponse({ status: HttpStatus.FOUND, description: '구글 로그인 페이지로 리다이렉트' })
    @Get('google')
    async googleAuth(@Res() res: Response) {
        res.redirect(this.authService.googleAuthURL());
    }

    @ApiOperation({ summary: '구글 인증 콜백' })
    @ApiResponse({ status: HttpStatus.FOUND, description: '구글 인증 성공 후 리다이렉트', type: Token })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
    @Get('google/callback')
    async googleAuthCallback(@Query() googleAuthDto: GoogleAuthDto, @Res() res: Response) {
        console.log(googleAuthDto);
        if (!googleAuthDto.code) {
            throw new BadRequestException(googleAuthDto.error);
        }
        const token = await this.authService.googleAuthCallback(googleAuthDto.code);
        res.redirect(`class-manager://login?access_token=${token.access_token}&refresh_token=${token.refresh_token}`);
    }

    @Post('send-email')
    @UseGuards(JwtAuthGuard)
    async sendEmail(@Request() req){
        return this.authService.sendEmail(req.user);
    }
}
