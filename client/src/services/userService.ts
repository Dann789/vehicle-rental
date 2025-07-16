import Swal from 'sweetalert2';

export interface User {
    user_id: number;
    nama: string;
    role_id: number;
    role: string;
    email: string;
    password: string;
    no_telp: string;
}

const API_BASE_URL = 'http://localhost:4000';

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

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const createUser = async (user: User): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || 'Failed to create user');
  }

  const data = await response.json();

  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data user berhasil ditambahkan!',
  });

  return data.user; // hanya return user, bukan message
};


export const updateUser = async (user_id: number, user: User): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/edit/${user_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data user berhasil diperbarui!',
    });
    return response.json();
};

export const deleteUser = async (user_id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${user_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data kendaraan berhasil dihapus!',
    });
    return response.json();
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || 'Invalid email or password');
  }

  const data = await response.json();

  // Simpan ke localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  // RETURN data supaya bisa dipakai di LoginPage
  return data;
};


