import { Disciplina, Matricula, Turma } from "../../interfaces"
import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import BackButton from "../../BackButton"
import { backgroundContainerCard, Card } from "../institutional/CampusPage"

interface Props {
    turma: Turma
}

export default function TurmaPage({
    turma
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Turma]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>N° {turma.id}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalic label="Turno" value={turma.turno} />
                    <LabelValueItalicLink href={`/buscar-entidades/disciplinas/${turma.disciplina?.id}`} label="Disciplina" value={turma.disciplina?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-usuarios/${turma.docente?.id}`} label="Docente" value={turma.docente?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/periodos/${turma.periodo?.id}`} label="Período" value={`${turma.periodo?.ano}.${turma.periodo?.semestre} `} />
                    
                    <hr className="mt-2 mb-2"></hr>
                    <LabelValueItalicLink href={`/buscar-entidades/cursos/${turma.disciplina?.curso?.nome}`} label="Curso" value={turma.disciplina?.curso?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/campi/${turma.campus?.nome}`} label="Campus" value={turma.campus?.nome || ''} />
                    <LabelValueItalic label="Criada em" value={turma.createdAt ? new Date(turma.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizada em" value={turma.updatedAt ? new Date(turma.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

                <div className="flex flex-1 flex-col mt-5">

                    <p className="font-bold">Matrículas [{turma.matriculas?.length || 0}]</p>

                    {turma.matriculas && turma.matriculas?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {turma.matriculas?.map((m: Matricula) => (
                                <Card
                                    key={m.id}
                                    title={`Nº ${m.id}`}
                                    label="Aluno"
                                    string={m.aluno?.matricula}
                                    href={`/buscar-entidades/matriculas/${m.id}`}
                                    />
                            ))}
                        
                        </div>

                        : 
                        <div>
                            <p className="text-sm italic">Nenhuma...</p>
                        </div>
                    }

                </div>
            </div>
        )

    }