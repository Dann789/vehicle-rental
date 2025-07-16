import { pool } from '../db/index';
import type { User } from '../models/userModel';
import bcrypt from 'bcrypt';

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(`
    SELECT
      u.user_id,
      u.nama,
      u.email,
      u.no_telp,
      u.role_id,
      r.nama_role AS role
    FROM users u
    LEFT JOIN role r ON u.role_id = r.role_id
    ORDER BY u.user_id ASC
  `);
  return result.rows;
};

export const createNewUser = async (user: User): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password.trim(), 10);
  const result = await pool.query(
    'INSERT INTO users (nama, role_id, email, password, no_telp) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, nama, role_id, email, no_telp',
    [user.nama, user.role_id, user.email, hashedPassword, user.no_telp]
  );
  return result.rows[0];
};

export const getUserById = async (user_id: number): Promise<User | null> => {
  const result = await pool.query(
    'SELECT user_id, nama, role_id, email, no_telp FROM users WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0] || null;
};
  
export const editUser = async (user_id: number, nama: string, role_id: number, email: string, password: string, no_telp: string): Promise<User | null> => {
  const result = await pool.query(
    'UPDATE users SET nama = $1, role_id = $2, email = $3, password = $4, no_telp = $5 WHERE user_id = $6 RETURNING user_id, nama, role_id, email, no_telp',
    [nama, role_id, email, password, no_telp, user_id]
  );
  return result.rows[0] || null;
};

export const removeUser = async (user_id: number): Promise<{ message: string }> => {
  await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
  return { message: `User with id ${user_id} deleted.` };
};

export const handleLoginUser = async (email: string, password: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};

