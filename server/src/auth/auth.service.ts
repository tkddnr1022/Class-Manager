import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInDto } from './dtos/sign-in.dto';
import { GetUserByEmailQuery } from 'src/user/queries/impl/get-user-by-email.query';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { Token } from './interfaces/token.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { KakaoError } from './interfaces/kakao-error.interface';
import { CreateOAuthCommand } from 'src/user/commands/impl/create-oauth.command';
import { KakaoUser } from './interfaces/kakao-user.interface';
import { GetUserByOIdQuery } from 'src/user/queries/impl/get-user-by-oid';
import { GoogleError } from './interfaces/google-error.interface';
import { GoogleUser } from './interfaces/google-user.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly mailerService: MailerService,
    ) { }

    // 비밀번호 검증
    async validateUser(signInDto: SignInDto) {
        const query = new GetUserByEmailQuery(signInDto.email);
        const user = await this.queryBus.execute(query);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(signInDto.password, user?.password);
        if (isMatch) {
            return user;
        }
        return null;
    }

    // 토큰 발급
    async signIn(user: any): Promise<Token> {
        const payload: Payload = {
            sub: user._id,
            username: user.username
        };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXP'),
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXP'),
        });
        return {
            access_token,
            refresh_token,
        };
    }

    async getKakaoToken(code: string): Promise<string> {
        const response = await firstValueFrom(this.httpService.post('https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: this.configService.get<string>('KAKAO_CLIENT_ID'),
                redirect_uri: `${this.configService.get<string>('API_URL')}/auth/kakao/callback`,
                code: code,
            }),
        ).pipe(
            catchError((error: AxiosError<KakaoError, any>) => {
                console.log(error.response.data);
                throw new BadRequestException(error.response.data.error_code);
            })
        ));
        return response.data.access_token;
    }

    async getKakaoUser(token: string): Promise<KakaoUser> {
        const response = await firstValueFrom(this.httpService.get('https://kapi.kakao.com/v2/user/me',
            { headers: { Authorization: `Bearer ${token}` } }
        ).pipe(
            catchError((error: AxiosError<KakaoError, any>) => {
                console.log(error.response.data);
                throw new BadRequestException(error.response.data.error_code);
            })
        ));
        return response.data;
    }

    async kakaoAuthCallback(code: string): Promise<Token> {
        const token = await this.getKakaoToken(code);
        const kakaoUser = await this.getKakaoUser(token);
        const query = new GetUserByOIdQuery(kakaoUser.id);
        const user = await this.queryBus.execute(query);
        if (user) {
            return this.signIn(user);
        }
        else {
            const command = new CreateOAuthCommand(kakaoUser.id, kakaoUser.kakao_account.email, 'kakao');
            const user = await this.commandBus.execute(command);
            return this.signIn(user);
        }
    }

    kakaoAuthURL(): string {
        const queryParams = new URLSearchParams({
            client_id: this.configService.get<string>('KAKAO_CLIENT_ID'),
            redirect_uri: `${this.configService.get<string>('API_URL')}/auth/kakao/callback`,
            response_type: 'code',
        });
        return `https://kauth.kakao.com/oauth/authorize?${queryParams.toString()}`;
    }

    async getGoogleToken(code: string): Promise<string> {
        const response = await firstValueFrom(this.httpService.post('https://oauth2.googleapis.com/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
                client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
                redirect_uri: `${this.configService.get<string>('API_URL')}/auth/google/callback`,
                code: code,
            }),
        ).pipe(
            catchError((error: AxiosError<GoogleError, any>) => {
                console.log(error.response.data);
                throw new BadRequestException(error.response.data.error);
            })
        ));
        return response.data.access_token;
    }

    async getGoogleUser(token: string): Promise<GoogleUser> {
        const response = await firstValueFrom(this.httpService.get('https://www.googleapis.com/oauth2/v2/userinfo',
            { headers: { Authorization: `Bearer ${token}` } }
        ).pipe(
            catchError((error: AxiosError<GoogleError, any>) => {
                console.log(error.response.data);
                throw new BadRequestException(error.response.data.error);
            })
        ));
        return response.data;
    }

    async googleAuthCallback(code: string): Promise<Token> {
        const token = await this.getGoogleToken(code);
        const googleUser = await this.getGoogleUser(token);
        const query = new GetUserByOIdQuery(googleUser.id);
        const user = await this.queryBus.execute(query);
        if (user) {
            return this.signIn(user);
        }
        else {
            const command = new CreateOAuthCommand(googleUser.id, googleUser.email, 'google');
            const user = await this.commandBus.execute(command);
            return this.signIn(user);
        }
    }

    googleAuthURL(): string {
        const queryParams = new URLSearchParams({
            client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            redirect_uri: `${this.configService.get<string>('API_URL')}/auth/google/callback`,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`;
    }

    async sendEmail(user: any) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Class-Manager 이메일 인증 코드입니다.',
            template: 'email',
            context: { code },
        });
    }
}
