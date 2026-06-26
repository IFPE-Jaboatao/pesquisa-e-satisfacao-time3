interface Props {
    title: string,
    color?: string,
    bolder?: boolean
}

export default function BuscaTitulo({title, color, bolder}: Props) {
    return (
        <p
        className={`font-${bolder ? 'bold' : 'semibold'} text-2xl text-center`}
        style={{ color: `var(${color ? color : '--dark-color'})`}}
        >{title}</p>
    )
}