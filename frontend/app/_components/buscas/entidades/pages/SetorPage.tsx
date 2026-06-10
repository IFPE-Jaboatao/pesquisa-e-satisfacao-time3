import { Setor } from "../interfaces"
import { LabelValueItalic } from "../InstitutionalCards"
import Link from "next/link"
import BackButton from "../BackButton"
import { backgroundContainerCard } from "./CampusPage"

interface Props {
    setor: Setor
}

export default function SetorPage({
    setor
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Setor]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>{setor.nome}</h2>
                </div>

                <hr />

                <LabelValueItalic label="Campus" value={setor.campusNome || ''} />
                <LabelValueItalic label="Criado em" value={setor.createdAt ? new Date(setor.createdAt).toLocaleString('pt-br') : ''} />
                <LabelValueItalic label="Atualizado em" value={setor.updatedAt ? new Date(setor.updatedAt).toLocaleString('pt-br') : ''} />

                <div className="flex flex-1 flex-col mt-5">

                    <p className="font-bold">Serviços [{setor.servicos?.length || 0}]</p>

                    {setor.servicos && setor.servicos?.length > 0 ? 
                        <div
                        style={{backgroundColor: 'var(--light-color)', borderColor: 'var(--grayish-color)'}}
                        className={`${backgroundContainerCard}`}>
                            {setor.servicos?.map((s) => (
                                <CardOnlyTitle
                                    key={s.id}
                                    title={s.nome}
                                    href={`/buscar-entidades/servicos/${s.id}`}
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

export function CardOnlyTitle({title, href}: {title:string, href: string}) {
    return (
        <Link
        href={href}
        style={{backgroundColor: 'var(--white)'}}
        className="p-1">
            <p className="font-semibold">{title}</p>
        </Link>
    )
}