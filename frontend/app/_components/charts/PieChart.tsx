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

export default function PieChart() {
    // função inicial de PieChart pra ser adaptada pra pegar os dados de perguntas de multipla escolha
  const data = {
    labels: ['Alimentação', 'Transporte', 'Lazer', 'Fixas'],
    datasets: [
      {
        label: 'Gastos',
        data: [1200, 450, 300, 2100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // Posição das legendas
      },
      title: {
        display: true,
        text: 'Distribuição de Gastos Mensais',
      },
    },
  };

  return <Pie data={data} options={options} />;
}