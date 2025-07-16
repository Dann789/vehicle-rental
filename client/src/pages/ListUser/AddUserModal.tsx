import React, { useState } from 'react';
import { createUser, type User } from '../../services/userService';

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddUserModal({
  isOpen,
  onClose,
  onCreated,
}: AddUserModalProps) {
  const [nama, setNama] = useState('');
  const [roleId, setRoleId] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const newUser: User = {
        nama: nama.trim(),
        role_id: roleId,
        email: email.trim(),
        password: password.trim(),
        no_telp: noTelp,
        user_id: 0,
        role: '',
    };

    const data = await createUser(newUser);
    console.log('Berhasil menambahkan user:', data);
    onCreated();
    onClose();
  } catch (err) {
    console.error(err);
    alert('Gagal menambahkan user.');
  } finally {
    setLoading(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              required
            >
              <option value="">Pilih Role</option>
              <option value={1}>Admin</option>
              <option value={2}>User</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">No Telp</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={noTelp}
              onChange={(e) => setNoTelp(e.target.value)}
              required
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
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
