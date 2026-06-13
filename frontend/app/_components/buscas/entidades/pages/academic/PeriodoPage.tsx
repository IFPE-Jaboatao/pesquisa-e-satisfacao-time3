import { Matricula, Periodo } from "../../interfaces"
import { LabelValueItalic, LabelValueItalicLink } from "../../InstitutionalCards"
import BackButton from "../../BackButton"

interface Props {
    periodo: Periodo
}

export default function PeriodoPage({
    periodo
    }: Props) {

        return(
            <div className="pb-10 flex-1 flex flex-col">
                <p className="text-sm font-bold">[Período]</p>
                 <div className="flex flex-row gap-1 mb-1">
                    <BackButton visible={false} route="/buscar-entidades" />
                    <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>{periodo.ano}.{periodo.semestre}</h2>
                </div>

                <hr />

                <div className="max-sm:flex max-sm:flex-col max-sm:gap-3">
                    <LabelValueItalic label="Início" value={periodo.startDate ? new Date(periodo.startDate).toLocaleDateString('pt-br', { timeZone: 'UTC'}) : ''} />
                    <LabelValueItalic label="Término" value={periodo.endDate ? new Date(periodo.endDate).toLocaleDateString('pt-br', { timeZone: 'UTC'}) : ''} />
                    
                    <LabelValueItalic label="Criada em" value={periodo.createdAt ? new Date(periodo.createdAt).toLocaleString('pt-br') : ''} />
                    <LabelValueItalic label="Atualizada em" value={periodo.updatedAt ? new Date(periodo.updatedAt).toLocaleString('pt-br') : ''} />
                </div>

            </div>
        )

    }