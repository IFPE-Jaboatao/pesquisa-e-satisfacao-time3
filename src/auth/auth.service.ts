import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Valida usuário no banco (MySQL)
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Senha inválida');
    }

    return user;
  }

  // Gera o token JWT com o payload sincronizado
  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}