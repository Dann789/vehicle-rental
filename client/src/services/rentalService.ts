import Swal from "sweetalert2";

export interface Rental {
    rental_id: number;
    user_id: number;
    kendaraan_id: number;
    start_date: string;
    end_date: string;
    total_harga: number;
    status: string;
}

const API_BASE_URL = 'http://localhost:4001';

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

export const getRentals = async (): Promise<Rental[]> => {
  const response = await fetch(`${API_BASE_URL}/rentals`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const getRentalById = async (id: number): Promise<Rental | null> => {
  const response = await fetch(`${API_BASE_URL}/rentals/${id}`, {
    headers: getAuthHeaders(),
  });
  if (response.ok) {
    return response.json();
  }
  return null;
};

export const getRentalByMonth = async (month: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/rentals/month/${month}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return Number(data.rentals);
};

export const getRentalByUser = async (user_id: number): Promise<Rental[]> => {
  const response = await fetch(`${API_BASE_URL}/rentals/user/${user_id}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export const updateRentalStatus = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/rentals/update-status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update rental status');
  }
};

export const updateEachRental = async (rental_id: number, status: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/rentals/update-status/${rental_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status: status }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update rental status');
  }
  return response.json();
}

export const addNewRental = async (rental: Rental): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/rentals/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(rental),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to add rental data');
  }
  Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Sewa Kendaraan berhasil diajukan',
  });
  return response.json();
}
