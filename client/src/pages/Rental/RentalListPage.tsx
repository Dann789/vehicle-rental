import { useEffect, useState } from 'react';
import { getRentals, type Rental, updateRentalStatus, updateEachRental } from '../../services/rentalService';
import { getUsers } from '../../services/userService';
import { getVehicles, type Vehicle } from '../../services/vehicleService';
import dayjs from 'dayjs';

interface RentalWithUser extends Rental {
  nama_user?: string;
  nama_kendaraan?: string;
  foto_url?: string;
  tipe_kendaraan?: string;
  harga_sewa_per_hari?: number;
}

function RentalListPage() {
  const [, setVehicles] = useState<Vehicle[]>([]);
  const [rentals, setRentals] = useState<RentalWithUser[]>([]);
  const [filterType, setFilterType] = useState('Semua');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    updateRentalStatus();

    const fetchData = async () => {
      try {
        const rentalData = await getRentals();
        const userData = await getUsers();
        const vehicleData = await getVehicles();

        setVehicles(vehicleData);

        const userMap: Record<number, string> = {};
        userData.forEach((user) => {
          userMap[user.user_id] = user.nama;
        });

        const vehicleMap: Record<number, { nama: string; foto_url: string; tipe: string, harga_sewa_per_hari: number }> = {};
        vehicleData.forEach((vehicle) => {
          vehicleMap[vehicle.kendaraan_id] = {
            nama: vehicle.nama,
            foto_url: vehicle.foto_url,
            tipe: vehicle.tipe,
            harga_sewa_per_hari: vehicle.harga_sewa_per_hari
          };
        });

        const mergedData = rentalData.map((rental) => ({
          ...rental,
          nama_user: userMap[rental.user_id] || 'Unknown User',
          nama_kendaraan: vehicleMap[rental.kendaraan_id]?.nama || 'Unknown Vehicle',
          foto_url: vehicleMap[rental.kendaraan_id]?.foto_url || '',
          tipe_kendaraan: vehicleMap[rental.kendaraan_id]?.tipe || '',
          harga_sewa_per_hari: vehicleMap[rental.kendaraan_id]?.harga_sewa_per_hari || 0
        }));

        setRentals(mergedData);
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (rentalId: number, newStatus: string) => {
    try {
      await updateEachRental(rentalId, newStatus);
      setRentals((prev) =>
        prev.map((rental) =>
          rental.rental_id === rentalId
            ? { ...rental, status: newStatus }
            : rental
        )
      );
    } catch (err) {
      alert('Gagal mengubah status');
      console.error(err);
    }
  };


  const filteredRentals = rentals.filter((rental) => {
    const matchSearch = rental.nama_kendaraan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'Semua' || rental.tipe_kendaraan === filterType;
    return matchSearch && matchType;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 mt-4">
      <h2 className="text-3xl font-bold mb-4">Riwayat Penyewaan</h2>
      <p className="text-gray-600 mb-8">
        Selamat datang di halaman riwayat penyewaan.
      </p>

      <div className='flex justify-start mb-6 gap-2'>
        <input
          type="text"
          className="border border-gray-300 rounded-2xl px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Cari nama penyewaan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-2xl px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="Semua">Semua Tipe</option>
          <option value="Mobil">Mobil</option>
          <option value="Elf">Elf</option>
          <option value="Bis">Bis</option>
          <option value="Motor">Motor</option>
        </select>
      </div>

      {filteredRentals.length === 0 ? (
        <p className="text-gray-500 text-center">Tidak ada data penyewaan.</p>
      ) : (
        <div className="overflow-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 border-b text-center">No</th>
                <th className="px-4 py-3 border-b text-center">Nama Kendaraan</th>
                <th className="px-4 py-3 border-b text-center">Nama Penyewa</th>
                <th className="px-4 py-3 border-b text-center">Tanggal Sewa</th>
                <th className="px-4 py-3 border-b text-center">Harga Asli</th>
                <th className="px-4 py-3 border-b text-center">Harga Diajukan</th>
                <th className="px-4 py-3 border-b text-center">Status</th>
                <th className="px-4 py-3 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental, index) => {
                const totalDays = dayjs(rental.end_date).diff(dayjs(rental.start_date), 'day');
                const hargaAsli = totalDays * rental.harga_sewa_per_hari;

                return (
                  <tr key={rental.rental_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{rental.nama_kendaraan}</td>
                    <td className="px-4 py-3 text-center">{rental.nama_user}</td>
                    <td className="px-4 py-3 text-center">{dayjs(rental.start_date).format('DD-MM-YYYY')} → {dayjs(rental.end_date).format('DD-MM-YYYY')}</td>
                    <td className="px-4 py-3 text-center">
                      Rp {hargaAsli.toLocaleString()} <br />
                    </td>
                    <td className="px-4 py-3 text-center">
                      Rp {Number(rental.total_harga).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${rental.status === 'Selesai'
                            ? 'text-green-600 bg-green-100'
                            : rental.status === 'berjalan'
                              ? 'text-blue-600 bg-blue-100'
                              : rental.status === 'Disewa'
                                ? 'text-yellow-600 bg-yellow-100'
                                : rental.status === 'Batal'
                                  ? 'text-red-600 bg-red-100'
                                  : 'text-gray-500 bg-gray-100'
                          }`}
                      >
                        {rental.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center align-content-center">
                      {rental.status === 'Menunggu' ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusUpdate(rental.rental_id, 'Disewa')}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                          >
                            <i className='fa-solid fa-check'></i>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(rental.rental_id, 'Batal')}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                          >
                            <i className='fa-solid fa-xmark'></i>
                          </button>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
}

export default RentalListPage;
