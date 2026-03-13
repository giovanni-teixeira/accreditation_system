import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioRepository } from '../../repositories/usuario.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usuarioRepository: UsuarioRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: any) {
        // O payload contém { sub: user.id, login: user.login, role: user.role }
        return { userId: payload.sub, login: payload.login, role: payload.role };
    }
}
