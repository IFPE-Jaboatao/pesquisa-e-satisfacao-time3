import ProgressBar from "./ProgressBar"

type Criterio = {
    criterio: string,
    porcentagem: string
}

type CriterioItem = {
    criterio: string,
    totalVotos: number,
    mediaValor: string,
    porcentagem: string
}

interface Props {
    items: CriterioItem[]
}

export default function CriteriosDocente({ items }: Props) {

    function ProgressCard({criterio, porcentagem}: Criterio) {
        const valorPorcentagem = Number(porcentagem.replace('%', ''));

        return (
        <div className="flex justify-end flex-row items-center gap-4 pb-5 mb-5">
            <p>{criterio}</p>
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