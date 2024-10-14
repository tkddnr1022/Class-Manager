import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Payload } from '../interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { GetUserQuery } from 'src/user/queries/impl/get-user.query';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Guard 사용 시 DB도 함께 검증
  async validate(payload: Payload) {
    const query = new GetUserQuery(payload.sub);
    const user = await this.queryBus.execute(query);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
