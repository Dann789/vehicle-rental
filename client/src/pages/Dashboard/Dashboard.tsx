import LineChart from '../../components/LineChart/LineChart';
import { useEffect, useState } from 'react';
import {
  getCarCount,
  getBusCount,
  getElfCount,
  getMotorCount,
} from '../../services/vehicleService';

function Dashboard() {
  const [carCount, setCarCount] = useState<number | null>(null);
  const [busCount, setBusCount] = useState<number | null>(null);
  const [elfCount, setElfCount] = useState<number | null>(null);
  const [motorCount, setMotorCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCarCount()
      .then(setCarCount)
      .catch((err) => setError(err.message));

    getBusCount()
      .then(setBusCount)
      .catch((err) => setError(err.message));

    getElfCount()
      .then(setElfCount)
      .catch((err) => setError(err.message));

    getMotorCount()
      .then(setMotorCount)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="px-4 mt-4">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Selamat datang di halaman dashboard.
      </p>
      {error && <p className="text-red-500">Gagal memuat data</p>}

      <div className="flex flex-row justify-between gap-5">
        <article className="rounded-lg border-2 border-gray-100 bg-white p-7 shadow-xs transition hover:shadow-lg sm:p-7 w-72">
          <i className="fa-solid fa-car text-4xl text-indigo-600 mb-2"></i>
          <h5 className="mb-2 text-xl font-semibold text-gray-800">
            Jumlah Mobil
          </h5>
          <p className="text-gray-500 text-2xl">
            {carCount !== null ? carCount : '0'}
          </p>
        </article>
        <article className="rounded-lg border-2 border-gray-100 bg-white p-7 shadow-xs transition hover:shadow-lg sm:p-7 w-72">
          <i className="fa-solid fa-bus text-4xl text-indigo-600 mb-2"></i>
          <h5 className="mb-2 text-xl font-semibold text-gray-800">
            Jumlah Bis
          </h5>
          <p className="text-gray-500 text-2xl">
            {busCount !== null ? busCount : '0'}
          </p>
        </article>
        <article className="rounded-lg border-2 border-gray-100 bg-white p-7 shadow-xs transition hover:shadow-lg sm:p-7 w-72">
          <i className="fa-solid fa-van-shuttle text-4xl text-indigo-600 mb-2"></i>
          <h5 className="mb-2 text-xl font-semibold text-gray-800">
            Jumlah Elf
          </h5>
          <p className="text-gray-500 text-2xl">
            {elfCount !== null ? elfCount : '0'}
          </p>
        </article>
        <article className="rounded-lg border-2 border-gray-100 bg-white p-7 shadow-xs transition hover:shadow-lg sm:p-7 w-72">
          <i className="fa-solid fa-motorcycle text-4xl text-indigo-600 mb-2"></i>
          <h5 className="mb-2 text-xl font-semibold text-gray-800">
            Jumlah Motor
          </h5>
          <p className="text-gray-500 text-2xl">
            {motorCount !== null ? motorCount : '0'}
          </p>
        </article>
      </div>

      <LineChart />
    </div>
  );
}

export default Dashboard;