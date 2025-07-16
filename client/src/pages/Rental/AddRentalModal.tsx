import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { getVehicles } from '../../services/vehicleService';
import { addNewRental } from '../../services/rentalService';
import { getLoggedInUser } from '../../utils/auth';

function getCurrentUserId() {
  const user = getLoggedInUser();
  return user ? user.user_id : null;
}

function AddRentalModal({ onClose }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error('Gagal memuat data kendaraan', error);
      }
    };
    fetchVehicles();
  }, []);

  const selectedVehicle = vehicles.find(
    (v) => v.kendaraan_id === Number(selectedVehicleId)
  );

  let totalDays = 0;
  let originalPrice = 0;

  if (selectedVehicle && startDate && endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    totalDays = end.diff(start, 'day');
    if (totalDays > 0) {
      originalPrice = totalDays * selectedVehicle.harga_sewa_per_hari;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = getCurrentUserId();

      if (!userId) {
        alert('User tidak terdeteksi. Silakan login ulang.');
        return;
      }

      const rentalData = {
        user_id: userId,
        kendaraan_id: Number(selectedVehicleId),
        start_date: startDate,
        end_date: endDate,
        total_harga: Number(customPrice),
        status: 'Menunggu',
      };

      console.log(rentalData);

      await addNewRental(rentalData);

      onClose();
    } catch (err) {
      console.error('Gagal menyimpan sewa', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Sewa</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown kendaraan */}
          <div>
            <label className="block text-gray-700 mb-1">Nama Kendaraan</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              required
            >
              <option value="">Pilih Kendaraan</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.kendaraan_id} value={vehicle.kendaraan_id}>
                  {vehicle.nama} - {vehicle.tipe}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal awal */}
          <div>
            <label className="block text-gray-700 mb-1">Tanggal Awal Sewa</label>
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* Tanggal akhir */}
          <div>
            <label className="block text-gray-700 mb-1">Tanggal Akhir Sewa</label>
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Harga asli */}
          {selectedVehicle && startDate && endDate && totalDays > 0 && (
            <p className="text-gray-800 font-semibold">
              Harga Asli: Rp{selectedVehicle.harga_sewa_per_hari} x {totalDays} hari = Rp{originalPrice}
            </p>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Harga Akhir (Boleh Ditawar)</label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

export default AddRentalModal;
