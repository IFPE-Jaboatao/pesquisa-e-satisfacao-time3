interface ProgressProps {
  value: number;
}

export default function ProgressBar({
  value,
}: ProgressProps) {
  if (value > 100) value = 100;
  else if (value < 0) value = 1;
  const hue = (value / 100) * 120;

  return (
    <div className="h-4 w-100 rounded-full bg-gray-200">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          backgroundColor: `hsl(${hue}, 80%, 45%)`,
        }}
      />
    </div>
  );
}