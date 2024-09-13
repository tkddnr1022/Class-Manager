import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SignInDto } from './dtos/sign-in.dto';
import { GetUserByEmailQuery } from 'src/user/queries/impl/get-user-by-email.query';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto): Promise<{access_token: string}>{
        const query = new GetUserByEmailQuery(signInDto.email);
        const user = await this.queryBus.execute(query);
        const isMatch = await bcrypt.compare(signInDto.password, user.password);
        if(!isMatch){
            throw new UnauthorizedException();
        }
        const payload = { sub: user._id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
