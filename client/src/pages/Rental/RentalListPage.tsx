import { useEffect, useState, type SetStateAction } from 'react';
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
    let userData = [];
    let vehicleData: SetStateAction<Vehicle[]> = [];
    let userMap: Record<number, string> = {};
    let vehicleMap: Record<number, { nama: string; foto_url: string; tipe: string, harga_sewa_per_hari: number }> = {};

    try {
      const rentalData = await getRentals();

      // Try get user data
      try {
        userData = await getUsers();
        userData.forEach((user) => {
          userMap[user.user_id] = user.nama;
        });
      } catch {
        // If user service error, use 'Unknown'
        userMap = {};
      }

      // Try get vehicle data
      try {
        vehicleData = await getVehicles();
        vehicleData.forEach((vehicle) => {
          vehicleMap[vehicle.kendaraan_id] = {
            nama: vehicle.nama,
            foto_url: vehicle.foto_url,
            tipe: vehicle.tipe,
            harga_sewa_per_hari: vehicle.harga_sewa_per_hari
          };
        });
      } catch {
        // If vehicle service error, use 'Unknown'
        vehicleMap = {};
      }

      setVehicles(vehicleData);

      const mergedData = rentalData.map((rental) => ({
        ...rental,
        nama_user: userMap[rental.user_id] ?? 'Unknown',
        nama_kendaraan: vehicleMap[rental.kendaraan_id]?.nama ?? 'Unknown',
        foto_url: vehicleMap[rental.kendaraan_id]?.foto_url,
        tipe_kendaraan: vehicleMap[rental.kendaraan_id]?.tipe,
        harga_sewa_per_hari: vehicleMap[rental.kendaraan_id]?.harga_sewa_per_hari
      }));

      setRentals(mergedData);
    } catch (err) {
      setError('Gagal memuat data rental');
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

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <i className="fas fa-car text-4xl"></i>
            <h2 className="text-4xl font-bold">Riwayat Penyewaan</h2>
          </div>
          <p className="text-blue-100 text-lg">
            Kelola dan pantau semua aktivitas penyewaan kendaraan dengan mudah.
          </p>
        </div>

        {/* Combined Search, Filter and Table Section */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Search and Filter Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Cari nama kendaraan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <select
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
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
              </div>
            </div>

            {/* Table Section */}
            {filteredRentals.length === 0 ? (
              <div className="p-12 text-center">
                <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada data penyewaan</h3>
                <p className="text-gray-500">Belum ada penyewaan yang tercatat dalam sistem.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-center text-sm font-semibold">No</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Nama Kendaraan</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Nama Penyewa</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Tanggal Sewa</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Harga Asli</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Harga Diajukan</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRentals.map((rental, index) => {
                      const totalDays = dayjs(rental.end_date).diff(dayjs(rental.start_date), 'day');
                      const hargaAsli = totalDays * (rental.harga_sewa_per_hari ?? 0);

                      return (
                        <tr key={rental.rental_id} className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-md ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              {rental.foto_url && (
                                <img 
                                  src={`http://localhost:5000${rental.foto_url}`} 
                                  alt={rental.nama_kendaraan} 
                                  className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                                />
                              )}
                              <span className="text-sm font-medium text-gray-900 text-center">{rental.nama_kendaraan ?? 'Kendaraan Tidak Tersedia'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">{rental.nama_user ?? 'User Tidak Dikenal'}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{dayjs(rental.start_date).format('DD/MM/YYYY')}</div>
                              <div className="text-gray-500">→ {dayjs(rental.end_date).format('DD/MM/YYYY')}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-green-600">Rp {hargaAsli.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-blue-600">Rp {Number(rental.total_harga).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              rental.status === 'Selesai' ? 'text-green-700 bg-green-100' :
                              rental.status === 'berjalan' ? 'text-blue-700 bg-blue-100' :
                              rental.status === 'Disewa' ? 'text-yellow-700 bg-yellow-100' :
                              rental.status === 'Batal' ? 'text-red-700 bg-red-100' :
                              'text-gray-700 bg-gray-100'
                            }`}>
                              <i className={`fas ${
                                rental.status === 'Selesai' ? 'fa-check-circle' :
                                rental.status === 'berjalan' ? 'fa-play-circle' :
                                rental.status === 'Disewa' ? 'fa-clock' :
                                rental.status === 'Batal' ? 'fa-times-circle' :
                                'fa-question-circle'
                              }`}></i>
                              {rental.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rental.status === 'Menunggu' ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(rental.rental_id, 'Disewa')}
                                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                                  title="Setujui Penyewaan"
                                >
                                  <i className="fas fa-check text-sm"></i>
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(rental.rental_id, 'Batal')}
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                                  title="Tolak Penyewaan"
                                >
                                  <i className="fas fa-times text-sm"></i>
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
              <div>
                <h3 className="text-red-800 font-semibold">Terjadi Kesalahan</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>

  );
}

export default RentalListPage;
