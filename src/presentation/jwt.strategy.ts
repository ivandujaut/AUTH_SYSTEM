import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/domain/types/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TEST_SECRET', // replace with config in production
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
