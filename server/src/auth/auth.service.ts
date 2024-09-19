import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SignInDto } from './dtos/sign-in.dto';
import { GetUserByEmailQuery } from 'src/user/queries/impl/get-user-by-email.query';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // 비밀번호 검증
    async validateUser(signInDto: SignInDto) {
        const query = new GetUserByEmailQuery(signInDto.email);
        const user = await this.queryBus.execute(query);
        const isMatch = await bcrypt.compare(signInDto.password, user?.password);
        if (isMatch) {
            return user;
        }
        return null;
    }

    // 토큰 발급
    async signIn(user: any): Promise<{ access_token: string, refresh_token: string }> {
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
}
