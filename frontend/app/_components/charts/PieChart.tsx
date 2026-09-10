'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function PieChart({dados, opcoes}: {dados: string[], opcoes: string[]}) {

  const contagemRespostas = dados.reduce<Record<string, number>>((acc, resposta) => {
    acc[resposta] = (acc[resposta] || 0) + 1;
    return acc;
  }, {});

  const dadosContados = opcoes.map((opcao) => contagemRespostas[opcao] || 0);

  const data = {
    labels: opcoes,
    datasets: [
      {
        label: 'Gastos',
        data: dadosContados,
        backgroundColor: [
          'rgba(0, 150, 0, 0.7)',
          'rgba(0, 250, 0, 0.7)',
          'rgba(10, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
    },
  };

  return <Pie data={data} options={options} />;
}