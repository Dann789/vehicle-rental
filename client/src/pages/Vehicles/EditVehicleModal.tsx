import React, { useEffect, useState } from 'react';
import { getVehicleById, updateVehicle, type Vehicle } from '../../services/vehicleService';

type EditVehicleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
  onUpdated: (updatedVehicle: Vehicle) => void;
};

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicleId,
  onUpdated,
}: EditVehicleModalProps) {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [hargaSewa, setHargaSewa] = useState('');
  const [tersedia, setTersedia] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleId && isOpen) {
      setLoading(true);
      getVehicleById(vehicleId)
        .then((data) => {
          if (!data) {
            console.error('Data kendaraan tidak ditemukan.');
            setLoading(false);
            return;
          }

          setNama(data.nama);
          setTipe(data.tipe);
          setPlatNomor(data.plat_nomor);
          setTersedia(data.tersedia);
          setHargaSewa(String(data.harga_sewa_per_hari));
          setFoto(data.foto_url ? new File([], data.foto_url) : null);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [vehicleId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('tipe', tipe);
    formData.append('plat_nomor', platNomor);
    formData.append('tersedia', tersedia ? 'true' : 'false');
    formData.append('harga_sewa_per_hari', Number(hargaSewa).toString());
    if (foto) formData.append('foto_url', foto);

    try {
      const updatedVehicle = await updateVehicle(vehicleId!, formData);
      onUpdated(updatedVehicle);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !vehicleId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded-2xl shadow w-full max-w-xl">
        <div className='max-h-[90vh] overflow-y-auto rounded-2xl p-6'>
        <h2 className="text-xl font-bold mb-4">Edit Kendaraan</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className=" grid gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">Nama Kendaraan</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div>
                <label className="block text-gray-700 mb-2">Tipe Kendaraan</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  required
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Elf">Elf</option>
                  <option value="Bis">Bis</option>
                  <option value="Motor">Motor</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Plat Nomor</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={platNomor}
                  onChange={(e) => setPlatNomor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div>
                <label className="block text-gray-700 mb-2">Harga Sewa / Hari</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={hargaSewa}
                  onChange={(e) => setHargaSewa(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={tersedia ? 'Tersedia' : 'Disewa'}
                  onChange={(e) => setTersedia(e.target.value === 'Tersedia')}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Disewa">Disewa</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">
                  Ganti Foto Kendaraan (Opsional)
                </label>

                <div className="mb-3 w-full flex justify-center">
                  {foto ? (
                    <img
                      src={foto instanceof File && foto.size > 0
                        ? URL.createObjectURL(foto)
                        : `http://localhost:5000${foto.name}`
                      }
                      alt="Foto kendaraan"
                      className="w-64 h-40 object-cover rounded shadow border border-gray-300"
                    />
                  ) : (
                    <div className="w-64 h-40 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500">Tidak ada foto</span>
                    </div>
                  )}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 px-3 py-2 rounded"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFoto(e.target.files[0]);
                  } else {
                    setFoto(null);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 col-span-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
