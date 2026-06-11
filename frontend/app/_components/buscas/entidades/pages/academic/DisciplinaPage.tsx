import { Disciplina, Turma } from "../../interfaces"
import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import BackButton from "../../BackButton"
import { backgroundContainerCard, Card } from "../institutional/CampusPage"

interface Props {
    disciplina: Disciplina
}

export default function DisciplinaPage({
    disciplina
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Disciplina]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>{disciplina.nome}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalicLink href={`/buscar-entidades/cursos/${disciplina.cursoId}`} label="Curso" value={disciplina.cursoNome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/campi/${disciplina.campusId}`} label="Campus" value={disciplina.campusNome || ''} />
                    <LabelValueItalic label="Criada em" value={disciplina.createdAt ? new Date(disciplina.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizada em" value={disciplina.updatedAt ? new Date(disciplina.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

                <div className="flex flex-1 flex-col mt-5">

                    <p className="font-bold">Turmas [{disciplina.turmas?.length || 0}]</p>

                    {disciplina.turmas && disciplina.turmas?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {disciplina.turmas?.map((t: Turma) => (
                                <Card
                                    key={t.id}
                                    title={`Nº ${t.id} - ${t.turno}`}
                                    label="Matrículas"
                                    value={t.matriculas?.length}
                                    href={`/buscar-entidades/turmas/${t.id}`}
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