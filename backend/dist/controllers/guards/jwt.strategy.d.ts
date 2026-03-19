import { Strategy } from 'passport-jwt';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usuarioRepository;
    constructor(usuarioRepository: UsuarioRepository);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        login: string;
        role: string;
    }>;
}
export {};
