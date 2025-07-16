import { useEffect, useState } from 'react';
import { getVehicleById, getVehicles, type Vehicle, deleteVehicle } from '../../services/vehicleService';
import VehicleModal from './AddVehicleModal';
import VehicleDetailModal from './VehicleDetailModal';
import EditVehicleModal from './EditVehicleModal';
import Swal from 'sweetalert2';



export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [hargaSewa, setHargaSewa] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [, setLoadingDetail] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);


  const handleShowDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const data = await getVehicleById(id);
      setSelectedVehicle(data);
      setShowDetail(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil detail kendaraan');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleVehicleCreated = (newVehicle: Vehicle) => {
    setVehicles((prev) => {
      const updated = [...prev, newVehicle];
      return updated.sort((a, b) => a.kendaraan_id - b.kendaraan_id);
    });
    setShowModal(false);
  };


  const handleEdit = (id: number) => {
    setSelectedVehicleId(id);
    setIsEditModalOpen(true);
  };

  const confirmDelete = (id: number) => {
  Swal.fire({
    title: 'Konfirmasi Hapus',
    text: 'Apakah Anda yakin ingin menghapus kendaraan ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteVehicle(id);
        // Hapus dari state
        setVehicles((prev) => prev.filter((v) => v.kendaraan_id !== id));
        Swal.fire('Terhapus!', 'Data kendaraan berhasil dihapus.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Gagal', 'Gagal menghapus kendaraan.', 'error');
      }
    }
  });
};


  useEffect(() => {
    getVehicles()
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter data
  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch = v.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'Semua' || v.tipe === filterType;
    return matchSearch && matchType;
  });

  const handleVehicleUpdated = (updatedVehicle: Vehicle) => {
    setVehicles((prev) => {
      const updated = prev.map((v) =>
        v.kendaraan_id === updatedVehicle.kendaraan_id
          ? updatedVehicle
          : v
      );
      return updated.sort((a, b) => a.kendaraan_id - b.kendaraan_id);
    });
  };


  return (
    <div className="px-4 mt-4">
      <h3 className="text-3xl font-bold mb-4">List Kendaraan</h3>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            className="border border-gray-300 rounded-2xl px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Cari nama kendaraan..."
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
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto">
          <i className="fas fa-plus"></i> Tambah Kendaraan
        </button>
      </div>

      {/* Tabel Card */}
      <div className="bg-white border border-gray-300 rounded-2xl shadow">
        <div className="overflow-auto rounded-2xl">
        {loading && (
          <p className="p-4 text-gray-700 text-center">Loading...</p>
        )}
        {error && (
          <p className="p-4 text-red-600 text-center">Gagal memuat data kendaraan</p>
        )}

        {!loading && !error && (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-sky-100">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-gray-700">No</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Tipe</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Harga Sewa / Hari</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((v, index) => (
                <tr key={v.kendaraan_id}>
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">{v.nama}</td>
                  <td className="px-4 py-3 text-center">{v.tipe}</td>
                  <td className="px-4 py-3 text-center">{v.harga_sewa_per_hari.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center ">{v.tersedia === true ?
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">Tersedia</span>
                    : <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">Disewa</span>}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm" onClick={() => handleShowDetail(v.kendaraan_id)}>
                      <i className='fas fa-circle-info'></i> Detail
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" onClick={() => handleEdit(v.kendaraan_id)}>
                      <i className='fas fa-edit'></i> Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm" onClick={() => confirmDelete(v.kendaraan_id)}>
                      <i className='fas fa-trash'></i> Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-600">
                    Tidak ada kendaraan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        </div>
      </div>
      <VehicleModal
        isOpen={showModal}
        onCreated={handleVehicleCreated}
        onClose={() => setShowModal(false)}
        nama={nama}
        setNama={setNama}
        tipe={tipe}
        setTipe={setTipe}
        platNomor={platNomor}
        setPlatNomor={setPlatNomor}
        hargaSewa={hargaSewa}
        setHargaSewa={setHargaSewa}
        foto={foto}
        setFoto={setFoto}
      />
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
      <EditVehicleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vehicleId={selectedVehicleId}
        onUpdated={handleVehicleUpdated}
      />


    </div>
  );
}
