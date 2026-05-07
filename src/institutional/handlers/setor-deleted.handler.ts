import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CampusDeletedEvent } from "src/shared/events/campus-deleted.event";
import { SetorService } from "../setor/setor.service";
import { SetorDeletedEvent } from "src/shared/events/setor-deleted.event";
import { ServicoService } from "../servico/servico.service";

@Injectable()
export class SetorDeletedHandler {
  constructor(
    private readonly servicoService: ServicoService,
  ) {}

  @OnEvent('setor.deleted')
  async handle(event: SetorDeletedEvent) {
    // retorna os servicos não deletados daquele setor
    const servicos = await this.servicoService.findBySetor(event.setorId);

    // deletando cada servico
    for (const servico of servicos) {
        await this.servicoService.remove(servico.id)
    }
  }
}