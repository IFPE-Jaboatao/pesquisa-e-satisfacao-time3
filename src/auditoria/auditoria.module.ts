import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';

@Global() // Torna o serviço disponível em todo o projeto sem precisar importar em cada módulo
@Module({
  imports: [TypeOrmModule.forFeature([Auditoria], 'mongo')],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}