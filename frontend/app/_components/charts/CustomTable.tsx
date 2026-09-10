export function SimpleTable({data}: {data: string[]}) {

  return (
    <table className="rounded bg-gray-100 flex flex-col border flex-1 pb-1 overflow-y-auto" style={{borderColor: 'var(--grayish-color)'}}>
        <thead>
            <tr>
            <th className="p-1 pl-2 text-left rounded">
                Respostas
            </th></tr>
        </thead>
        <tbody className="flex-1 gap-1 flex flex-col justify-center">
        {data.map((i) => (
        <tr className="flex-1 bg-white shadow-2xl" key={i}><td className="p-1">{i}</td></tr>
        ))}
        </tbody>
    </table>
  )
}