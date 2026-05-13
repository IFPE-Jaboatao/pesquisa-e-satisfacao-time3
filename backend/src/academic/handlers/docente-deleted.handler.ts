import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TurmaService } from "../turma/turma.service";
import { DocenteDeletedEvent } from "src/shared/events/docente-deleted.event";

@Injectable()
export class DocenteDeletedHandler {
  constructor(
    private readonly turmaService: TurmaService,
  ) {}

  @OnEvent('docente.deleted')
  async handle(event: DocenteDeletedEvent) {
    // retorna os turmas não deletadas daquele docente
    const turmas = await this.turmaService.findByDocente(event.docenteId);
    
    // deleta cada turma
    for (const turma of turmas) {
        await this.turmaService.remove(turma.id)
    }
  }
}