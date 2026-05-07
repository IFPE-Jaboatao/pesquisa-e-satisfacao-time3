import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
// IMPORTAÇÕES DO SWAGGER
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse 
} from '@nestjs/swagger';

@ApiTags('Auth') // Cria a categoria "Auth" no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Realizar login e obter o Token de Acesso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso. Retorna o access_token.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas (usuário ou senha incorretos).' 
  })
  @HttpCode(HttpStatus.OK) // Garante que retorne 200 em vez de 201 no POST de login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Chama o serviço de autenticação para validar o usuário
     if (!loginDto) {
      throw new BadRequestException('Body não enviado');
    }

    const { username, password } = loginDto;

    // validação dos campos
    if (!username || !password) {
      throw new BadRequestException('Username e password são obrigatórios');
    }

    // retorna user após confirmação validação da senha enviada com a senha armazenada do usuário
    const user = await this.authService.validateUser(username, password);

    // validação de credenciais
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
  }
}