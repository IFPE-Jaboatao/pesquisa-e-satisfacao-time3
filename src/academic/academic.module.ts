import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

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

import { Curso } from './curso/entities/curso.entity';
import { Disciplina } from './disciplina/entities/disciplina.entity';
import { Turma } from './turma/entities/turma.entity';
import { Periodo } from './periodo/entities/periodo.entity';
import { Matricula } from './matricula/entities/matricula.entity';
import { Campus } from 'src/institutional/campus/entities/campus.entity';
import { User } from 'src/users/user.entity';
import { CampusDeletedHandler } from './handlers/campus-deleted.handler';
import { CursoDeletedHandler } from './handlers/curso-deleted.handler';
import { DisciplinaDeletedHandler } from './handlers/disciplina-deleted.handler';
import { TurmaDeletedHandler } from './handlers/turma-deleted.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Disciplina, Turma, Periodo, Matricula, Campus, User], 'mysql')
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
        MatriculaService,
        CampusDeletedHandler,
        CursoDeletedHandler,
        DisciplinaDeletedHandler,
        TurmaDeletedHandler,
    ],
    exports: [
        CursoService,
        DisciplinaService,
        TurmaService,
        PeriodoService,
        MatriculaService,
    ],
})

export class AcademicModule {}
