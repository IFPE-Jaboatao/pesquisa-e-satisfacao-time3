import Link from "next/link"
import BasicButton from "../../BasicButton"

export interface Campus {
    id: number,
    nome: string,
    cidade: string,
    setores: number,
    cursos: number,
    createdAt: string,
    updatedAt: string
}

interface CampusObj {
    campus: Campus
}

export interface Setor {
    id: number,
    nome: string,
    campusId: number,
    campus: string,
    servicos: number,
    createdAt: string,
    updatedAt: string
}

interface SetorObj {
    setor: Setor
}


export interface Servico {
    id: number,
    nome: string,
    setorId: number,
    setor: string,
    campusId: number,
    campus: string,
    createdAt: string,
    updatedAt: string
}

interface ServicoObj {
    servico: Servico
}

export function CampiCard({ campus }: CampusObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Campus' value={campus.nome} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <LabelValueItalic label="Cidade" value={campus.cidade || ''} />
                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-between mt-1">

                    <div>
                        <LabelValueItalic label="Setores" value={campus.setores.toString()} />
                        <LabelValueItalic label="Cursos" value={campus.cursos.toString()} />
                    </div>

                <CreatedUpdatedCard createdAt={campus.createdAt} updatedAt={campus.updatedAt} />

                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Campus' route={`/buscar-entidades/campi/${campus.id}`} /> 
            </div>

        </div>
    )
}

export function SetorCard({ setor }: SetorObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Setor' value={setor.nome} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <LabelValueItalic label="Campus" value={setor.campus} />
                </div>

                <div className="flex flex-row max-lg:flex-col max-sm:flex-row justify-between mt-1">

                    <div>
                        <LabelValueItalic label="Serviços" value={setor.servicos.toString()} />
                    </div>

                <CreatedUpdatedCard createdAt={setor.createdAt} updatedAt={setor.updatedAt} />

                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Setor' route={`/buscar-entidades/setores/${setor.id}`} /> 
            </div>

        </div>
    )
}

export function ServicoCard({ servico }: ServicoObj) {
    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <TopTitle label='Serviço' value={servico.nome} />

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2">
                        <p className="italic">Setor:</p>
                        <p>{servico.setor}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <p className="italic">Campus:</p>
                        <p>{servico.campus}</p>
                    </div>
                </div>

                <CreatedUpdatedCard createdAt={servico.createdAt} updatedAt={servico.updatedAt} />

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Serviço' route={`/buscar-entidades/servicos/${servico.id}`} /> 
            </div>

        </div>
    )
}

export function TopTitle({label, value}: {label: string, value?:string}) {
    return(
            <div className="flex flex-row justify-start gap-2 items-center">
                <p className="font-bold text-sm">{label}</p>
                <p>{value}</p>
            </div>
    )
}

export function LabelValueItalic({label, value}: {label: string, value?:string}) {
    return (
        <div className="flex flex-row gap-2">
            <p className="italic">{label}:</p>
            <p>{value}</p>
        </div>
    )
}

export function LabelValueItalicLink({label, value, href}: {label: string, value:string, href: string}) {
    return (
        <Link href={href} className="flex flex-row gap-2 hover:text-cyan-600 rounded max-w-max">
            <p className="italic">{label}:</p>
            <p>{value}</p>
        </Link>
    )
}

export function CreatedUpdatedCard({createdAt, updatedAt}: {createdAt?: string, updatedAt?: string}) {
    return (
        <div className="flex flex-col justify-end items-end">
            <p className="max-lg:text-sm">Criado em: {createdAt}</p>
            <p className="max-lg:text-sm">Atualizado em: {updatedAt}</p>
        </div>
    )
}