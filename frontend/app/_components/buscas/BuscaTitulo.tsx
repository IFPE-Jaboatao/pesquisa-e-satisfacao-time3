interface Props {
    title: string
}

export default function BuscaTitulo({title}: Props) {
    return (
        <p
        className="font-semibold text-2xl text-center"
        style={{ color: 'var(--dark-color)'}}
        >{title}</p>
    )
}