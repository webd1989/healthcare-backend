import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // set true only if you want to allow expired tokens
      secretOrKey: 'Change&MePlease123', // must match the one you use in JwtModule
    });
  }

  async validate(payload: any) {
    // This will be attached to request.user
    return { userId: payload.sub, username: payload.username };
  }
}