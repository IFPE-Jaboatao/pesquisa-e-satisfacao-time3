import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MatriculaService } from "../matricula/matricula.service";
import { AlunoDeletedEvent } from "src/shared/events/aluno-deleted.event";

@Injectable()
export class AlunoDeletedHandler {
  constructor(
    private readonly matriculaService: MatriculaService,
  ) {}

  @OnEvent('aluno.deleted')
  async handle(event: AlunoDeletedEvent) {
    // retorna todas as matriculas não deletadas daquele aluno
    const matriculas = await this.matriculaService.findByAluno(event.alunoId);

    // deleta cada matricula
    for (const matricula of matriculas) {
        await this.matriculaService.remove(matricula.id)
    }
  }
}