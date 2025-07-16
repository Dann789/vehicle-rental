import React from 'react';
import { addVehicle, type Vehicle } from '../../services/vehicleService';

type VehicleModalProps = {
    isOpen: boolean;
    onClose: () => void;
    nama: string;
    setNama: (val: string) => void;
    tipe: string;
    setTipe: (val: string) => void;
    platNomor: string;
    setPlatNomor: (val: string) => void;
    hargaSewa: string;
    setHargaSewa: (val: string) => void;
    foto: File | null;
    setFoto: (val: File | null) => void;
    onCreated: (newVehicle: Vehicle) => void;
};

export default function VehicleModal({
    isOpen,
    onClose,
    nama,
    setNama,
    tipe,
    setTipe,
    platNomor,
    setPlatNomor,
    hargaSewa,
    setHargaSewa,
    foto,
    setFoto,
}: VehicleModalProps) {
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('tipe', tipe);
      formData.append('plat_nomor', platNomor);
      formData.append('harga_sewa_per_hari', Number(hargaSewa).toString());
      if (foto) formData.append('foto_url', foto);
    
      try {
        const data = await addVehicle(formData);
        console.log('Berhasil menambahkan kendaraan:', data);
        onClose();
      } catch (err) {
        console.error(err);
      }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="bg-white rounded-2xl shadow w-sm max-w-3xl p-6">
                <h2 className="text-xl font-bold mb-4">Tambah Kendaraan</h2>
                <form onSubmit={handleSubmit} typeof='multipart/form-data' >
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nama Kendaraan</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Plat Nomor</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            value={platNomor}
                            onChange={(e) => setPlatNomor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Harga Sewa / Hari</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            value={hargaSewa}
                            onChange={(e) => setHargaSewa(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Foto Kendaraan</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFoto(e.target.files[0]);
                                } else {
                                    setFoto(null);
                                }
                            }}
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
