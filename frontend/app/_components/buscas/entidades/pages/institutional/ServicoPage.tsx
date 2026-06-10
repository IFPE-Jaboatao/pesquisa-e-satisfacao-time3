import { Servico, Setor } from "../../interfaces"
import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import Link from "next/link"
import BackButton from "../../BackButton"

interface Props {
    servico: Servico
}

export default function ServicoPage({
    servico
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Serviço]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>{servico.nome}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalicLink href={`/buscar-entidades/setores/${servico.setor?.id}`} label="Setor" value={servico.setor?.nome || ''} />
                    <LabelValueItalicLink href={`/buscar-entidades/campi/${servico.setor?.campus?.id}`} label="Campus" value={servico.setor?.campus?.nome || ''} />
                    <LabelValueItalic label="Criado em" value={servico.createdAt ? new Date(servico.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizado em" value={servico.updatedAt ? new Date(servico.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

            </div>
        )

    }