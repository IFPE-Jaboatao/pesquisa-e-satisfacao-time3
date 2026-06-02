type CardItem = {
    label: string,
    value: number
}

interface Props {
    items: CardItem[]
}

export default function CardsDashboard({ items }: Props) {
    let total = 0;
    if (items.length > 1) {
        total = items.reduce((sum, item) => sum + item.value, 0);
    }

    function Card({value, label}: CardItem) {
        return (
        <div className="flex justify-between flex-col items-center gap-1 pb-3">
            <p className="text-m font-bold text-gray-400">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
        </div>)
    }

    return (
        <div className="pr-50 pt-5 pb-4 flex-row flex items-center justify-between"
            style={{ backgroundColor: 'var(--white)'}}>
        <div className={`${items.length > 3 ? 'grid grid-cols-4' : 'flex'} flex-1 justify-around`}>

        {items.map(i => (
            <Card key={i.label} value={i.value} label={i.label} />
            )
        )}

        </div>

        {items.length > 1 ? (
        <div className="border-l pl-10"
            style={{ borderColor: 'var(--grayish-color)'}} >
          <Card label="Total" value={total} />
        </div>

        ) : '' }
        

        </div>
    )
}