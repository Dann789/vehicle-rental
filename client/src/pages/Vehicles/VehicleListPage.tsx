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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <i className="fas fa-car text-4xl"></i>
            <h3 className="text-4xl font-bold">List Kendaraan</h3>
          </div>
          <p className="text-green-100 text-lg">
            Kelola dan pantau semua kendaraan yang tersedia dalam sistem.
          </p>
        </div>

        {/* Combined Search, Filter and Table Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Search, Filter and Add Button Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Cari nama kendaraan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <select
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
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
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Tambah Kendaraan
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Memuat data kendaraan...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 m-6">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                <div>
                  <h3 className="text-red-800 font-semibold">Terjadi Kesalahan</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Table Section */}
          {!loading && !error && (
            filteredVehicles.length === 0 ? (
              <div className="p-12 text-center">
                <i className="fas fa-car text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada kendaraan ditemukan</h3>
                <p className="text-gray-500">Belum ada kendaraan yang tercatat dalam sistem.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                      <tr>
                        <th className="px-6 py-4 text-center text-sm font-semibold">No</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Nama Kendaraan</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Tipe</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Harga Sewa / Hari</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentVehicles.map((v, index) => (
                        <tr key={v.kendaraan_id} className={`transition-all duration-200 hover:bg-green-50 hover:shadow-md ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{startIndex + index + 1}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              {v.foto_url && (
                                <img 
                                  src={`http://localhost:5000${v.foto_url}`} 
                                  alt={v.nama} 
                                  className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                                />
                              )}
                              <span className="text-sm font-medium text-gray-900 text-center">{v.nama}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">{v.tipe}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-green-600">Rp {v.harga_sewa_per_hari.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              v.tersedia ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                            }`}>
                              <i className={`fas ${v.tersedia ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                              {v.tersedia ? 'Tersedia' : 'Disewa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                className="w-10 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-md cursor-pointer"
                                onClick={() => handleShowDetail(v.kendaraan_id)}
                                title="Lihat Detail"
                              >
                                <i className="fas fa-circle-info text-sm"></i>
                              </button>
                              <button 
                                className="w-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-md cursor-pointer"
                                onClick={() => handleEdit(v.kendaraan_id)}
                                title="Edit Kendaraan"
                              >
                                <i className="fas fa-edit text-sm"></i>
                              </button>
                              <button 
                                className="w-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-md cursor-pointer"
                                onClick={() => confirmDelete(v.kendaraan_id)}
                                title="Hapus Kendaraan"
                              >
                                <i className="fas fa-trash text-sm"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          )}

          {/* Pagination Section */}
          {!loading && !error && (
            <div className="flex justify-between items-center p-4">
              <div className="text-sm text-gray-500">
                Menampilkan {currentVehicles.length} dari {filteredVehicles.length} kendaraan
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${
                      currentPage === i + 1
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
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
