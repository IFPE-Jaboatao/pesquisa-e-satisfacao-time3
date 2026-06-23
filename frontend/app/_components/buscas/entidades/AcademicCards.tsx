import BasicButton from "../../BasicButton"
import { CreatedUpdatedCard, LabelValueItalic, TopTitle } from "./InstitutionalCards"
import { Curso, Disciplina } from "./interfaces"

interface CursoObj {
    curso: Curso
}

interface DisciplinaObj {
    disciplina: Disciplina
}

export interface Turma {
    id: number,
    turno: string,
    disciplina: {
        id: number,
        nome: string
    },
    periodo: string,
    docente: {
        id: number,
        nome: string
    },
    matriculas: number,
    createdAt: string,
    updatedAt: string
}

interface TurmaObj {
    turma: Turma
}

export interface Periodo {
    id: number,
    ano: number,
    semestre: number,
    startDate: string,
    endDate: string,
    createdAt: string,
    updatedAt: string
}

interface PeriodoObj {
    periodo: Periodo
}

export interface Matricula {
    id: number,
    aluno: {
        id: number,
        nome: string,
        email: string,
        matricula: string
    },
    turma: {
        id: number,
        disciplina: string,
        periodo: string
    },
    campus: {
        id: number,
        nome: string
    }
    createdAt: string,
    updatedAt: string
}

interface MatriculaObj {
    matricula: Matricula
}

export function CursoCard({ curso }: CursoObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Curso' value={curso.nome} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <LabelValueItalic label="Campus" value={curso?.campus?.nome} />
                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-between mt-1">

                <LabelValueItalic label="Disciplinas" value={curso.disciplinas.length.toString()} />

                <CreatedUpdatedCard createdAt={curso.createdAt} updatedAt={curso.updatedAt} />

                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Curso' route={`/buscar-entidades/cursos/${curso.id}`} /> 
            </div>

        </div>
    )
}

export function DisciplinaCard({ disciplina }: DisciplinaObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Disciplina' value={disciplina.nome} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    
                    <LabelValueItalic label="Curso" value={disciplina.curso?.nome} />

                    <LabelValueItalic label="Campus" value={disciplina.campus} />

                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-end mt-1">

                    <CreatedUpdatedCard createdAt={disciplina.createdAt} updatedAt={disciplina.updatedAt} />

                </div>


            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Disciplina' route={`/buscar-entidades/disciplinas/${disciplina.id}`} /> 
            </div>

        </div>
    )
}

export function TurmaCard({ turma }: TurmaObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Turma' value={`${turma.id} de ${turma.disciplina.nome}`} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">

                    <LabelValueItalic label="Turno" value={turma.turno} />

                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-between mt-1">

                    <LabelValueItalic label="Matrículas" value={turma.matriculas.toString()} />

                    <CreatedUpdatedCard createdAt={turma.createdAt} updatedAt={turma.updatedAt} />

                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Turma' route={`/buscar-entidades/turmas/${turma.id}`} /> 
            </div>

        </div>
    )
}

export function PeriodoCard({ periodo }: PeriodoObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Período' value={`${periodo.ano}.${periodo.semestre}`} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">

                    <LabelValueItalic label="Começa em" value={periodo.startDate} />

                    <LabelValueItalic label="Termina em" value={periodo.endDate} />
                    
                </div>

                <div className="flex flex-col justify-end items-end">
                    <p className="max-sm:text-sm">Criado em: {periodo.createdAt.split(`T`)[0]}</p>
                    <p className="max-sm:text-sm">Atualizado em: {periodo.updatedAt.split(`T`)[0]}</p>
                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Período' route={`/buscar-entidades/periodos/${periodo.id}`} /> 
            </div>

        </div>
    )
}

export function MatriculaCard({ matricula }: MatriculaObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Matrícula' value={`#${matricula.id}`} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">

                     <LabelValueItalic label="Matrícula" value={matricula.aluno.matricula} />

                     <LabelValueItalic label="Turma" value={`${matricula.turma.id} ${matricula.turma.disciplina}`} />

                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-end mt-1">

                    <CreatedUpdatedCard createdAt={matricula.createdAt} updatedAt={matricula.updatedAt} />

                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Matrícula' route={`/buscar-entidades/matriculas/${matricula.id}`} /> 
            </div>

        </div>
    )
}