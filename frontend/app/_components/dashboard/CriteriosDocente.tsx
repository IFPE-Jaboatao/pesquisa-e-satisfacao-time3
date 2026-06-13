import ProgressBar from "./ProgressBar"

type Criterio = {
    criterio: string,
    porcentagem: string
}

export type CriterioItem = {
    criterio: string,
    totalVotos: number,
    mediaValor: string,
    porcentagem: string
}

interface Props {
    items: CriterioItem[],
    gap?: number,
    border?: boolean
}

export default function CriteriosDocente({ items, gap, border }: Props) {

    function ProgressCard({criterio, porcentagem}: Criterio) {
        const valorPorcentagem = Number(porcentagem.replace('%', ''));

        return (
        <div className={`flex justify-end flex-row items-center gap-4 ${gap ? `pb-${gap} mb-${gap} max-sm:mb-${gap + 1} max-sm:pb-${gap + 1}` : `pb-5 mb-5`} ${border ? `max-sm:border-b-2` : ``}`} style={{borderColor: 'var(--light-color)'}}>
            <p className="max-sm:text-sm max-sm:text-center">{criterio}</p>
            <ProgressBar value={valorPorcentagem} />
            <p className="font-semibold text-end" style={{ color: 'var(--grayish-color)'}}>{porcentagem}</p>
        </div>)
    }

    return (
        <div className="p5 grid grid-cols-1">

        {items.map((i) => 
            <ProgressCard criterio={i.criterio} key={i.criterio} porcentagem={i.porcentagem} />
        )}

        </div>
    )
}