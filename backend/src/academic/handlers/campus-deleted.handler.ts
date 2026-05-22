import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { CampusDeletedEvent } from "src/shared/events/campus-deleted.event";
import { Repository } from "typeorm";
import { Curso } from "../curso/entities/curso.entity";
import { CursoService } from "../curso/curso.service";

@Injectable()
export class CampusDeletedHandler {
  constructor(
    private readonly cursoService: CursoService,
  ) {}

  @OnEvent('campus.deleted')
  async handle(event: CampusDeletedEvent) {
    // retorna os cursos não deletados daquele campus
    const cursos = await this.cursoService.findByCampus(event.campusId);

    // deletando cada curso
    for (const curso of cursos) {
        await this.cursoService.remove(curso.id)
    }
  }
}