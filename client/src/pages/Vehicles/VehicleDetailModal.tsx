import { type Vehicle } from '../../services/vehicleService';

type VehicleDetailModalProps = {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function VehicleDetailModal({
    vehicle,
    isOpen,
    onClose,
}: VehicleDetailModalProps) {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-md max-w-3xl p-6 my-36">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        Detail Kendaraan
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="grid grid-rows-1 md:grid-rows-2 gap-6">
                    <div>
                        {vehicle.foto_url ? (
                            <img
                                src={`http://localhost:5000${vehicle.foto_url}`}
                                alt={vehicle.nama}
                                className="w-full h-64 object-cover rounded-lg shadow"
                            />
                        ) : (
                            <div className="text-gray-500 w-full h-64 flex items-center justify-center border border-dashed border-gray-300 rounded">
                                Tidak ada foto
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <h4 className="text-3xl font-semibold text-gray-800 mb-1 text-center">
                            {vehicle.nama}
                        </h4>
                        <p className="text-gray-600 mb-3 font-normal text-center">
                            ({vehicle.tipe})
                        </p>
                        <div className="grid">
                            <div className="grid grid-cols-2 mb-3">
                                <p className="text-gray-600 mb-1 text-center text-md font-medium">
                                    Plat Nomor:
                                </p>
                                <p className="text-gray-600 mb-1 text-center font-bold">
                                    {vehicle.plat_nomor}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 mb-3">
                                <p className="text-gray-600 mb-1 text-center text-md font-medium">
                                    Harga Sewa:
                                </p>
                                <p className="text-gray-600 mb-1 text-center font-bold">
                                    {vehicle.harga_sewa_per_hari.toLocaleString()}/hari
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="text-gray-600 mb-1 text-center text-md font-medium">
                                    Status:
                                </p>
                                <p className="text-gray-600 mb-1 text-center font-bold">
                                    <span className="font-medium">{vehicle.tersedia ?
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">Tersedia</span>
                                        : <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">Disewa</span>}</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
