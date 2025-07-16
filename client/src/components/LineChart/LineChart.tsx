import { useEffect, useState } from 'react';
import { getRentalByMonth } from '../../services/rentalService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const [rentalData, setRentalData] = useState<number[]>([]);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buat array jan-jun
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const promises = months.map((month) => getRentalByMonth(month));
        const results = await Promise.all(promises);

        setRentalData(results);
      } catch (error) {
        console.error('Error fetching rental data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Jumlah Sewa Kendaraan',
        data: rentalData,
        fill: true,
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#334155',
        },
      },
      title: {
        display: true,
        text: 'Grafik Sewa Kendaraan per Bulan',
        color: '#1e293b',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#334155' },
        grid: { color: '#e2e8f0' },
      },
      y: {
        ticks: { color: '#334155' },
        grid: { color: '#e2e8f0' },
      },
    },
  };

  return (
    <div className="bg-white mt-8 p-6 rounded-lg shadow w-full max-w-6xl mx-auto border-2 border-gray-100 overflow-x-auto">
      <Line data={data} options={options} />
    </div>
  );
}
