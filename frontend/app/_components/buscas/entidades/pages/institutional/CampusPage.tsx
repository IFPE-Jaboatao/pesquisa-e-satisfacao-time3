import { Button } from "flowbite-react"
import { Campus } from "../../interfaces"
import InputLabel from "@/app/_components/InputLabel"
import { LabelValueItalic } from "../../InstitutionalCards"
import BasicButton from "@/app/_components/BasicButton"
import Link from "next/link"
import BackButton from "../../BackButton"

interface Props {
    campus: Campus
}

export default function CampusPage({
    campus
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">

                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Campus {campus.nome}</h2>
                </div>

                <hr />

                <LabelValueItalic label="Cidade" value={campus.cidade || ''} />
                <LabelValueItalic label="Criado em" value={campus.createdAt ? new Date(campus.createdAt).toLocaleString('pt-br') : ''} />
                <LabelValueItalic label="Atualizado em" value={campus.updatedAt ? new Date(campus.updatedAt).toLocaleString('pt-br') : ''} />

                <div className="flex flex-1 flex-col mt-5">

                    <p className="font-bold">Cursos [{campus.cursos?.length || 0}]</p>

                    {campus.cursos && campus.cursos?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {campus.cursos?.map((c) => (
                                <Card
                                    key={c.id}
                                    title={c.nome}
                                    label="Disciplinas"
                                    value={c.disciplinas?.length || 0}
                                    href={`/buscar-entidades/cursos/${c.id}`}
                                    />
                            ))}
                        
                        </div>

                        : 
                        <div>
                            <p className="text-sm italic">Nenhum...</p>
                        </div>
                    }


                    <p className="font-bold">Setores [{campus.setores?.length || 0}]</p>

                    {campus.setores && campus.setores?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {campus.setores?.map((s) => (
                                <Card
                                    key={s.id}
                                    title={s.nome}
                                    label="Serviços"
                                    value={s.servicos?.length || 0}
                                    href={`/buscar-entidades/setores/${s.id}`}
                                    />
                        ))}
                    
                    </div>

                    : 
                    <div>
                        <p className="text-sm italic">Nenhum...</p>
                    </div>
                }
    
                </div>
            </div>
        )

    }

export const backgroundContainerCard = 'm-1 grid grid-cols-4 gap-1 border p-1 max-sm:grid-cols-2';

export function Card({title, label, value, string, italic, href}: {title:string, label:string, value?:number, string?: string, italic?: boolean, href: string}) {
    return (
        <Link
        href={href}
        style={{backgroundColor: 'var(--white)'}}
        className={`p-1`}>
            <p className="font-semibold">{title}</p>
            <p className={`${italic ? 'italic' : ''}`}>{label}: {value || string || ''}</p>
        </Link>
    )
}