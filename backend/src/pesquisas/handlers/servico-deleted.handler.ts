import { Injectable } from '@nestjs/common'; // ou o framework que estiver usando
import { OnEvent } from '@nestjs/event-emitter';
import { PesquisasService } from '../pesquisas.service';
import { Tipo } from '../pesquisa-tipo.enum';

@Injectable()
export class ServicoDeletedHandlerPesquisa {
  constructor(
    
    private readonly pesquisasService: PesquisasService,
  ) {}

  @OnEvent('servico.deleted')
  async handleServicoDeletedEvent(payload: { servicoId: number }) {
    const { servicoId } = payload;

    await this.pesquisasService.softDelete(servicoId, Tipo.SATISFACAO);
    
  }
}