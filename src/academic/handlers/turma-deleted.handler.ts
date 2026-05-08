import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TurmaDeletedEvent } from "src/shared/events/turma-deleted.event";
import { MatriculaService } from "../matricula/matricula.service";

@Injectable()
export class TurmaDeletedHandler {
  constructor(
    private readonly matriculaService: MatriculaService,
  ) {}

  @OnEvent('turma.deleted')
  async handle(event: TurmaDeletedEvent) {
    // retorna todas as matriculas não deletadas daquela turma
    const matriculas = await this.matriculaService.findByTurma(event.turmaId);

    // deleta cada matricula
    for (const matricula of matriculas) {
        await this.matriculaService.remove(matricula.id)
    }
  }
}