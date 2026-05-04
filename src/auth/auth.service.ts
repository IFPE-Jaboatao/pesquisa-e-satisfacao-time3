import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Valida as credenciais do usuário comparando o hash da senha no MySQL.
   * @param matricula Matrícula do usuário vindo do DTO de login
   * @param password Senha em texto puro vindo do DTO de login
   */
  async validateUser(matricula: string, password: string): Promise<any> {
    const user = await this.usersService.findByMatricula(matricula);

    // Se o usuário não existir, lança erro 401
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Compara a senha enviada com o hash salvo no banco
    const isMatch = await bcrypt.compare(password, user.password);

    // Se a senha não bater, lança erro 401
    if (!isMatch) {
      throw new UnauthorizedException('Senha inválida');
    }

    // Retorna o objeto user (sem a senha seria o ideal, mas o login() filtrará o payload)
    return user;
  }

  /**
   * Gera o Token de Acesso (JWT) baseado nos dados do usuário validado.
   * @param user Objeto do usuário retornado pelo validateUser
   */
  async login(user: any) {
    // Payload sincronizado com os Guards e logs de auditoria
    const payload = {
      sub: user.id,          // ID do usuário (usado como 'sub' no padrão JWT)
      matricula: user.matricula,
      role: user.role        // Necessário para o RolesGuard
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}