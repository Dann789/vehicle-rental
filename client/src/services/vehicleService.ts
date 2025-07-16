import Swal from 'sweetalert2';

export interface Vehicle {
  kendaraan_id: number;
  nama: string;
  tipe: string;
  plat_nomor: string;
  harga_sewa_per_hari: number;
  tersedia: boolean;
  foto_url: string;
}

const API_BASE_URL = 'http://localhost:5000';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Unauthorized',
      text: 'Anda harus login terlebih dahulu.',
    });
    window.location.href = '/';
    throw new Error('Unauthorized: Anda harus login.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE_URL}/vehicles`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data kendaraan');
  }
  return res.json();
}

export async function addVehicle(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/vehicles/add`, {
    method: 'POST',
    body: formData,
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server error:', errorText);
    throw new Error('Gagal menambahkan kendaraan: ' + errorText);
  }
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data kendaraan berhasil ditambahkan!',
  });
  return res.json();
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data kendaraan');
  }
  return res.json();
}

export async function getCarCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/vehicles/mobil`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data jumlah mobil');
  }
  const data = await res.json();
  return Number(data.countCar);
}

export async function getBusCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/vehicles/bis`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data jumlah bis');
  }
  const data = await res.json();
  return Number(data.countBus);
}

export async function getElfCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/vehicles/elf`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data jumlah elf');
  }
  const data = await res.json();
  return Number(data.countElf);
}

export async function getMotorCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/vehicles/motor`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data jumlah motor');
  }
  const data = await res.json();
  return Number(data.countMotor);
}

export async function updateVehicle(id: number, formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PUT',
    body: formData,
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server error:', errorText);
    throw new Error('Gagal memperbarui kendaraan: ' + errorText);
  }
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data kendaraan berhasil diperbarui!',
  });
  return res.json();
}

export async function deleteVehicle(id: number) {
  const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server error:', errorText);
    throw new Error('Gagal menghapus kendaraan: ' + errorText);
  }
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data kendaraan berhasil dihapus!',
  });
  return res.json();
}

