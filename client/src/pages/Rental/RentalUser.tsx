import { useEffect, useState } from 'react';
import { type Rental, updateRentalStatus, getRentalByUser } from '../../services/rentalService';
import { getUsers } from '../../services/userService';
import { getVehicles, type Vehicle } from '../../services/vehicleService';
import { getLoggedInUser } from '../../utils/auth';
import AddRentalModal from './AddRentalModal';
import dayjs from 'dayjs';

interface RentalWithUser extends Rental {
    nama_kendaraan?: string;
    foto_url?: string;
    tipe_kendaraan?: string;
}

function RentalListPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [, setVehicles] = useState<Vehicle[]>([]);
    const [rentals, setRentals] = useState<RentalWithUser[]>([]);
    const [filterType, setFilterType] = useState('Semua');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        updateRentalStatus();

        const fetchData = async () => {
            try {
                const loggedInUser = getLoggedInUser();
                const userIdString = loggedInUser?.user_id || ''
                if (!userIdString) {
                    setError('User belum login.');
                    setLoading(false);
                    return;
                }

                const user_id = parseInt(userIdString);

                // 🔥 Pakai getRentalByUser
                const rentalData = await getRentalByUser(user_id);
                const userData = await getUsers();
                const vehicleData = await getVehicles();

                setVehicles(vehicleData);

                const userMap: Record<number, string> = {};
                userData.forEach((user) => {
                    userMap[user.user_id] = user.nama;
                });

                const vehicleMap: Record<number, { nama: string; foto_url: string; tipe: string }> = {};
                vehicleData.forEach((vehicle) => {
                    vehicleMap[vehicle.kendaraan_id] = {
                        nama: vehicle.nama,
                        foto_url: vehicle.foto_url,
                        tipe: vehicle.tipe,
                    };
                });

                const mergedData = rentalData.map((rental) => ({
                    ...rental,
                    nama_kendaraan: vehicleMap[rental.kendaraan_id]?.nama || 'Unknown Vehicle',
                    foto_url: vehicleMap[rental.kendaraan_id]?.foto_url || '',
                    tipe_kendaraan: vehicleMap[rental.kendaraan_id]?.tipe || '',
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

    const filteredRentals = rentals.filter((rental) =>
        filterType === 'Semua' || rental.tipe_kendaraan === filterType
    );

    return (
        <div className="px-4 mt-4">
            <h2 className="text-3xl font-bold mb-4">Riwayat Penyewaan Saya</h2>
            <p className="text-gray-600 mb-8">
                Berikut adalah riwayat penyewaan yang Anda lakukan.
            </p>

            <div className='flex justify-end mb-6'>
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
                <button className='text-white px-4 py-2 rounded w-full md:w-auto bg-green-600 hover:bg-green-700 ml-3 cursor-pointer' onClick={() => setIsAddModalOpen(true)}>
                    <i className='fa fa-add'></i> Tambah Sewa
                </button>
            </div>

            {loading && <p className="text-gray-500 text-center">Memuat data...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {filteredRentals.length === 0 && (
                <p className="text-gray-500 text-center">Tidak ada data penyewaan.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRentals.map((rental) => (
                    <div
                        key={rental.rental_id}
                        className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
                    >
                        {rental.foto_url ? (
                            <img
                                src={`http://localhost:5000${rental.foto_url}`}
                                alt={rental.nama_kendaraan}
                                className="w-full h-48 object-cover rounded-2xl mb-2"
                                loading='lazy'
                            />
                        ) : (
                            <div className="text-gray-500 w-full h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-2xl mb-2">
                                Tidak ada foto
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {rental.nama_kendaraan}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                            <span className="font-semibold">Tanggal Sewa:</span>{' '}
                            {dayjs(rental.start_date).format('DD MMM YYYY')} → {dayjs(rental.end_date).format('DD MMM YYYY')}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                            <span className="font-semibold">Harga yang diajukan:</span>{' '}
                            Rp {Number(rental.total_harga).toLocaleString()}
                        </p>
                        <span
                            className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${rental.status === 'Selesai'
                                ? 'text-green-600 bg-green-100'
                                : rental.status === 'Menunggu'
                                    ? 'text-gray-600 bg-gray-100'
                                    : rental.status === 'Disewa'
                                        ? 'text-yellow-600 bg-yellow-100'
                                        : 'text-red-600 bg-red-100'
                                }`}
                        >
                            {rental.status.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
            {isAddModalOpen && (
                <AddRentalModal
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>

    );
}

export default RentalListPage;
