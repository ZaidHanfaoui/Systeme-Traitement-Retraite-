import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PaiementBarChartProps {
  data: { [type: string]: number };
}

const PaiementBarChart: React.FC<PaiementBarChartProps & { pension?: number }> = ({ data, pension }) => {
  const chartData = {
    labels: ['Pension', ...Object.keys(data)],
    datasets: [
      {
        label: 'Montant',
        data: [pension ?? 0, ...Object.values(data)],
        backgroundColor: ['#009688', '#43e97b', '#43e97b', '#43e97b'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Pension vs Paiements',
        color: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#444' },
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#444' },
      },
    },
  };

  return <Bar data={chartData} options={options} height={180} />;
};

export default PaiementBarChart;
