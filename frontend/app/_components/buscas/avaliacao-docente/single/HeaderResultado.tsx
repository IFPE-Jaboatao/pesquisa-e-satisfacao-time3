import BackButton from "../../entidades/BackButton"

export default function HeaderResultado() {
    return (
        <div className="mb-2 pt-2 pl-3 pb-2 flex flex-row gap-2 items-center shadow-2xs">
            <BackButton visible={false} route='/buscar-avaliacoes-docente' />
            <p className="font-semibold text-xl" style={{color: 'var(--grayish-color)'}}>Detalhes da Avaliação Docente</p>
        </div>
    )
}