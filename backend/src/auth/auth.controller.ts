import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // proteção contra body undefined
    if (!body) {
      throw new BadRequestException('Body não enviado');
    }

    const { matricula, password } = body;

    // validação dos campos
    if (!matricula || !password) {
      throw new BadRequestException('Matrícula e password são obrigatórios');
    }

    const user = await this.authService.validateUser(matricula, password);

    // validação de credenciais
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
  }
}