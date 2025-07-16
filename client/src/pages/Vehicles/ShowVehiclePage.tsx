import { useEffect, useState } from "react";
import { type Vehicle, getVehicles } from "../../services/vehicleService";
import "../../App.css";

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <div
      className={`min-w-[300px] max-w-[300px] p-4 rounded-xl shadow-md ${vehicle.tipe === "Mobil"
          ? "bg-blue-50"
          : vehicle.tipe === "Motor"
            ? "bg-green-50"
            : vehicle.tipe === "Elf"
              ? "bg-purple-50"
              : "bg-pink-50"
        }`}
    >
      <img
        src={`http://localhost:5000${vehicle.foto_url}`}
        alt={vehicle.nama}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-bold">{vehicle.nama}</h3>
      <p className="text-sm text-gray-500 mb-2">Plat Nomor: {vehicle.plat_nomor}</p>

      <div className="flex justify-between text-xs text-gray-700 mb-2">
        <span className="text-green-700">
          {vehicle.tersedia ? <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">Tersedia</span>
            : <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">Disewa</span>}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sky-600 font-bold text-md">
          Rp{Number(vehicle.harga_sewa_per_hari).toLocaleString()}
          <span className="text-sm font-normal">/hari</span>
        </span>
        <button className="bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition cursor-pointer" onClick={() => window.location.href = `/rentaluser`}>
          Sewa Sekarang
        </button>
      </div>
    </div>
  );
};

const ScrollContainer = ({
  title,
  vehicles,
}: {
  title: string;
  vehicles: Vehicle[];
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative overflow-hidden pb-3">
        <div className="flex gap-6 animate-scroll">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.kendaraan_id} vehicle={vehicle} />
          ))}
          {/* Duplicate for seamless infinite scroll */}
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={`dup-${vehicle.kendaraan_id}`}
              vehicle={vehicle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function ShowVehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const types = ["Motor", "Mobil", "Elf", "Bis"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-4 mt-4">
      <h1 className="text-3xl font-bold mb-10">Daftar Kendaraan Terpopuler</h1>

      {types.map((type) => {
        const filtered = vehicles.filter((v) => v.tipe === type);
        if (filtered.length === 0) return null;
        return (
          <ScrollContainer key={type} title={type} vehicles={filtered} />
        );
      })}
    </div>
  );
}

export default ShowVehiclePage;
