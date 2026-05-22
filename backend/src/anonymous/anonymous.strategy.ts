import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as crypto from 'crypto';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  // REMOVIDO: constructor com super() que causava o erro TS2554

  async validate(req: any) {
    try {
      // Tenta ler o cookie 'anonId' (preenchido pelo cookieParser no main.ts)
      let anonId = req.cookies?.anonId;

      if (!anonId) {
        anonId = crypto.randomUUID();

        // Define o cookie na resposta para as próximas requisições
        if (req.res) {
          req.res.cookie('anonId', anonId, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
          });
        }
      }

      // Gera o fingerprint baseado no IP e Navegador
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || '';
      const fingerprint = crypto
        .createHash('sha256')
        .update(ip + userAgent)
        .digest('hex');

      // Retorna os dados que o RespostasService vai receber no parâmetro 'user'
      return {
        anonId,
        fingerprint,
      };
    } catch (error) {
      console.error('Erro na AnonymousStrategy:', error);
      return null;
    }
  }
}