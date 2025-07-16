import pkg from 'pg';
const { Pool } = pkg;

// Buat pool koneksi PostgreSQL
export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'rental_db',
});
