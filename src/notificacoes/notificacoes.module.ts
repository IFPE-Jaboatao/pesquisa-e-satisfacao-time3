import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';

@Module({
  providers: [NotificacoesService],
  exports: [NotificacoesService], // Exporta caso outros módulos precisem no futuro
})
export class NotificacoesModule {}