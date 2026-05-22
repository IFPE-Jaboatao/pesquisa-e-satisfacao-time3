import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CampusDeletedEvent } from "src/shared/events/campus-deleted.event";
import { SetorService } from "../setor/setor.service";

@Injectable()
export class CampusDeletedHandler {
  constructor(
    private readonly setorService: SetorService,
  ) {}

  @OnEvent('campus.deleted')
  async handle(event: CampusDeletedEvent) {
    // retorna os setores não deletados daquele campus
    const setores = await this.setorService.findByCampus(event.campusId);

    // deletando cada setor
    for (const setor of setores) {
        await this.setorService.remove(setor.id)
    }
  }
}