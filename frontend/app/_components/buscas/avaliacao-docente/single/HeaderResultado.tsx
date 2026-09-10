import BackButton from "../../entidades/BackButton"

export default function HeaderResultado({pesquisa}: {pesquisa?: boolean}) {
    return (
        <div className="mb-2 pt-2 pl-3 pb-2 flex flex-row gap-2 items-center shadow-2xs">
            <BackButton visible={false} route={`/buscar-${pesquisa ? 'pesquisas-satisfacao' : 'avaliacoes-docente'}`} />
            <p className="font-semibold text-xl" style={{color: 'var(--grayish-color)'}}>{`${pesquisa ? 'Resumo das Respostas' : 'Detalhes da Avaliação Docente'}`}</p>
        </div>
    )
}

export function HeaderResponder({pesquisa}: {pesquisa?: boolean}) {
    return (
        <div className="mb-2 pt-2 pl-3 pb-2 flex flex-row gap-2 items-center shadow-2xs">
            <BackButton visible={false} route={`/buscar-${pesquisa ? 'pesquisas-satisfacao' : 'avaliacoes-docente'}`} />
            <p className="font-semibold text-xl" style={{color: 'var(--grayish-color)'}}>Responda a {pesquisa ? 'Pesquisa de Satisfação' : 'Avaliação Docente'}</p>
        </div>
    )
}