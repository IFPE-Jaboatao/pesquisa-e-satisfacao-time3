import { Curso, Disciplina } from "../../interfaces"
import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import BackButton from "../../BackButton"
import { backgroundContainerCard, Card } from "../institutional/CampusPage"

interface Props {
    curso: Curso
}

export default function CursoPage({
    curso
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Curso]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>{curso.nome}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalicLink href={`/buscar-entidades/campi/${curso.campusId}`} label="Campus" value={curso.campusNome || ''} />
                    <LabelValueItalic label="Criado em" value={curso.createdAt ? new Date(curso.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizado em" value={curso.updatedAt ? new Date(curso.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

                <div className="flex flex-1 flex-col mt-5">

                    <p className="font-bold">Disciplinas [{curso.disciplinas?.length || 0}]</p>

                    {curso.disciplinas && curso.disciplinas?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {curso.disciplinas?.map((d: Disciplina) => (
                                <Card
                                    key={d.id}
                                    title={d.nome}
                                    label="Código"
                                    string={d.codigo}
                                    href={`/buscar-entidades/disciplinas/${d.id}`}
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