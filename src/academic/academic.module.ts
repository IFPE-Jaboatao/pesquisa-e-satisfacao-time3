import { Module } from '@nestjs/common';
import { CursoModule } from './curso/curso.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { TurmaModule } from './turma/turma.module';
import { PeriodoModule } from './periodo/periodo.module';
import { MatriculaModule } from './matricula/matricula.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoController } from './curso/curso.controller';
import { DisciplinaController } from './disciplina/disciplina.controller';
import { TurmaController } from './turma/turma.controller';
import { PeriodoController } from './periodo/periodo.controller';
import { MatriculaController } from './matricula/matricula.controller';
import { CursoService } from './curso/curso.service';
import { DisciplinaService } from './disciplina/disciplina.service';
import { TurmaService } from './turma/turma.service';
import { PeriodoService } from './periodo/periodo.service';
import { MatriculaService } from './matricula/matricula.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CursoModule, DisciplinaModule, TurmaModule, PeriodoModule, MatriculaModule], 'mysql')
],
    controllers: [
        CursoController,
        DisciplinaController,
        TurmaController,
        PeriodoController,
        MatriculaController
    ],
    providers: [
        CursoService,
        DisciplinaService,
        TurmaService,
        PeriodoService,
        MatriculaService
    ],
    exports: [
        CursoService,
        DisciplinaService,
        TurmaService,
        PeriodoService,
        MatriculaService
    ],
})
export class AcademicModule {}
