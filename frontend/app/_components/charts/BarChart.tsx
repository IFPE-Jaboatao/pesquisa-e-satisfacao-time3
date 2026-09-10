'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({dados, escalaMax}: {dados: string[], escalaMax: number}) {

    const labels = [];
    for (let i = 1; i <= escalaMax; i++) {
        labels.push(i);
    } 

  const contagemRespostas = dados.reduce<Record<number, number>>((acc, valorStr) => {
    const num = Number(valorStr);
    if (!isNaN(num) && num >= 1 && num <= escalaMax) {
      acc[num] = (acc[num] || 0) + 1;
    }
    return acc;
  }, {});

  const dadosContados = labels.map((nota) => contagemRespostas[nota] || 0);
    
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Quantidade',
        data: dadosContados,
        backgroundColor: 'rgba(0, 250, 0, 0.6)',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
        }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return <Bar data={data} options={options} />;
}