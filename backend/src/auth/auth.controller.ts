import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza o login e gera o token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas (Matrícula ou senha incorretos).' })
  @ApiBody({ type: LoginDto })
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

    // Mantém a lógica exigida: busca o usuário inteiro antes de gerar o token
    const user = await this.authService.validateUser(matricula, password);

    // validação de credenciais
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
  }
}