import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import BackButton from "../../BackButton"

export interface MatriculaNative {
        id: number,
        createdAt: string,
        updatedAt: string,
        aluno: {
            id: number,
            nome: string,
            matricula: string,
            email: string
        },
        turma: {
            id: number,
            disciplina: {
                id: number,
                nome: string,
                curso: {
                    id: number,
                    nome: string,
                    campus: {
                        id: number,
                        nome: string
            }
                }
            },
            docente: {
                id: number,
                nome: string,
                matricula: string
            },
            periodo: {
                id: number,
                ano: number,
                semestre: number
            }
        }
    }

interface Props {
    matricula: MatriculaNative
}

export default function MatriculaPage({
    matricula
    }: Props) {
        console.log(matricula)
        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Matrícula]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>N° {matricula.id}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalicLink href={`/buscar-entidades/turmas/${matricula.turma?.id}`} label="Turma" value={`${matricula.turma?.id}` || ''} />
                    <LabelValueItalicLink href={`/buscar-usuarios/${matricula.aluno?.id}`} label="Aluno" value={matricula.aluno?.nome || ''} />
                    
                    <hr className="mt-2 mb-2"></hr>
                    <LabelValueItalicLink href={`/buscar-entidades/disciplinas/${matricula.turma?.disciplina?.id}`} label="Disciplina" value={matricula.turma?.disciplina?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-usuarios/${matricula.turma?.docente?.id}`} label="Docente" value={matricula.turma?.docente?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/periodos/${matricula.turma?.periodo?.id}`} label="Período" value={`${matricula.turma?.periodo?.ano}.${matricula.turma?.periodo?.semestre} `} />
                    
                    <hr className="mt-2 mb-2"></hr>
                    <LabelValueItalicLink href={`/buscar-entidades/cursos/${matricula.turma?.disciplina?.curso?.id}`} label="Curso" value={matricula.turma?.disciplina?.curso.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/campi/${matricula.turma?.disciplina?.curso?.campus?.id}`} label="Campus" value={matricula.turma?.disciplina?.curso?.campus?.nome || ''} />
                    <LabelValueItalic label="Criada em" value={matricula.createdAt ? new Date(matricula.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizada em" value={matricula.updatedAt ? new Date(matricula.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

            </div>
        )

    }