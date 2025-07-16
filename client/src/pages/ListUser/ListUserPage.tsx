import { useEffect, useState } from 'react';
import { deleteUser, getUsers, type User } from '../../services/userService';
import AddUserModal from './AddUserModal';
import Swal from 'sweetalert2';
import EditUserModal from './EditUserModal';



function ListUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  // Ambil data users
  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus pengguna ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Data pengguna berhasil dihapus!',
            });

            // hapus user dari state
            setUsers((prev) => prev.filter((user) => user.user_id !== id));
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Gagal menghapus pengguna.',
            });
          });
      }
    });
  };

  // Filter data user
  const filteredUsers = users.filter((user) => {
    const matchSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'Semua' || user.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="mt-4 px-4">
      <h2 className="text-3xl font-bold mb-4">Daftar Pengguna</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5 ">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama pengguna..."
            className="border border-gray-300 rounded-2xl px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-2xl px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="Semua">Semua Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
          onClick={() => { setIsAddModalOpen(true); }}
        >
          <i className="fas fa-plus"></i> Tambah User
        </button>
      </div>
      <div className="bg-white border border-gray-300 rounded-2xl shadow">
        <div className="overflow-auto rounded-2xl">
          {loading && (
            <p className="text-gray-700 text-center py-4">Loading data...</p>
          )}

          {error && (
            <p className="text-red-600 text-center py-4">Gagal memuat data user</p>
          )}

          {!loading && !error && (
            <table className="min-w-full w-full table-auto divide-y divide-gray-200 text-sm">
              <thead className="bg-sky-100">
                <tr>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">No</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">No Telp</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{user.nama}</td>
                    <td className="px-4 py-3 text-center">{user.role}</td>
                    <td className="px-4 py-3 text-center">{user.email}</td>
                    <td className="px-4 py-3 text-center">{user.no_telp}</td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => confirmDelete(user.user_id)}
                      >
                        <i className="fas fa-trash"></i> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>


      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => {
          setIsAddModalOpen(false);
          getUsers().then((data) => setUsers(data));
        }}
      />
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={() => {
          getUsers().then((data) => setUsers(data));
          setEditingUser(null);
        }}
        initialData={editingUser}
      />
    </div>

  );
}

export default ListUserPage;
