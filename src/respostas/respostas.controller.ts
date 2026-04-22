import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RespostasService } from './respostas.service';
import { AnonymousGuard } from '../anonymous/anonymous.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EnviarRespostaDto } from './dto/enviar-resposta.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

type AnonymousUser = {
  anonId: string;
  fingerprint: string;
};

@Controller('respostas')
export class RespostasController {
  constructor(private readonly service: RespostasService) {}

  //  PÚBLICO (ANÔNIMO)
  @UseGuards(AnonymousGuard)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post('enviar')
  enviar(
    @Req() req: { user?: AnonymousUser },
    @Body() dto: EnviarRespostaDto,
  ) {
    const user = req.user;

    //  valida segurança
    if (!user?.anonId || !user?.fingerprint) {
      throw new UnauthorizedException('Usuário anônimo inválido');
    }

    return this.service.registrar(dto, user);
  }

  // ???
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('relatorio/:pesquisaId')
  @Roles(Role.GESTOR)
  relatorio(@Param('pesquisaId') pesquisaId: string) {
    return this.service.relatorio(pesquisaId);
  }
}