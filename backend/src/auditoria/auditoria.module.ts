import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Adicionado para resolver o erro do CLI
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';

@Global() // Torna o serviço disponível em todo o projeto sem precisar importar em cada módulo
@Module({
  imports: [
    // Registro da entidade no MongoDB
    TypeOrmModule.forFeature([Auditoria], 'mongo'),
    
    // Adicionado para resolver o erro: "Nest can't resolve dependencies of the AuditoriaService"
    EventEmitterModule.forRoot(), 
  ],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}