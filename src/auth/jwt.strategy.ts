import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET não definido no .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Importante para segurança
      secretOrKey: secret, 
    });
  }

  // O que este método retorna vira o "req.user"
  async validate(payload: any) {
    // Verificação de segurança: se o payload não tiver os dados básicos, barra o acesso
    if (!payload.sub || !payload.matricula) {
      throw new UnauthorizedException('Token inválido ou malformado.');
    }

    return {
      id: payload.sub,        // Padronizamos como 'id' para facilitar no Controller
      matricula: payload.matricula,
      role: payload.role
    };
  }
}