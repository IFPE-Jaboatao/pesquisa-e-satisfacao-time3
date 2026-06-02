interface Props {
  value: number;
}

export default function KpiDocente({
  value,
}: Props) {
  if (value > 100) value = 100;
  else if (value < 0) value = 1;

  const hue = (value / 100) * 120;

  return (
    <div className="h-100 w-100 max-md:h-60 max-md:w-60 bg-gray-200">
      <div
        className="h-full transition-all duration-300 justify-center flex flex-col"
        style={{
          backgroundColor: `hsl(${hue}, 70%, 85%)`,
        }}
      > 
      <p className="text-center text-xl font-semibold" style={{ color: 'var(--grayish-color)'}}>Desempenho Geral</p>
      <p className="text-center text-4xl font-bold" style={{ color: `hsl(${hue}, 70%, 35%)`}}>{value}%</p>
      </div>
    </div>
  );
}