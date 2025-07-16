import { pool } from '../db/index';

export const getAllVehicles = async () => {
  const result = await pool.query('SELECT * FROM kendaraan ORDER BY kendaraan_id ASC');
  return result.rows;
};

export const getVehicleCar = async () => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM kendaraan WHERE tipe = $1',
    ['Mobil']
  );
  return Number(result.rows[0].count);
};

export const getVehicleBus = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM kendaraan WHERE tipe = $1', ['Bis']);
  return Number(result.rows[0].count);
};
export const getVehicleElf = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM kendaraan WHERE tipe = $1', ['Elf']);
  return Number(result.rows[0].count);
};
export const getVehicleMotor = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM kendaraan WHERE tipe = $1', ['Motor']);
  return Number(result.rows[0].count);
};

export const getVehicleById = async (id: number) => {
  const result = await pool.query(
    `SELECT kendaraan_id, nama, tipe, plat_nomor, tersedia, harga_sewa_per_hari, foto_url 
     FROM kendaraan 
     WHERE kendaraan_id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createVehicle = async (data: any) => {
  const {
    nama,
    tipe,
    plat_nomor,
    harga_sewa_per_hari,
    tersedia,
    foto_url,
  } = data;

  const result = await pool.query(
    `INSERT INTO kendaraan
     (nama, tipe, plat_nomor, harga_sewa_per_hari, tersedia, foto_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nama, tipe, plat_nomor, harga_sewa_per_hari, tersedia, foto_url]
  );

  return result.rows[0];
};

export const updateVehicle = async (id: number, data: any) => {
  const {
    nama,
    tipe,
    plat_nomor,
    harga_sewa_per_hari,
    tersedia,
    foto_url,
  } = data;

  const result = await pool.query(
    `UPDATE kendaraan
     SET nama = $1,
         tipe = $2,
         plat_nomor = $3,
         harga_sewa_per_hari = $4,
         tersedia = $5,
         foto_url = $6
     WHERE kendaraan_id = $7
     RETURNING *`,
    [nama, tipe, plat_nomor, harga_sewa_per_hari, tersedia, foto_url, id]
  );

  return result.rows[0];
};

export const deleteVehicle = async (id: number) => {
  await pool.query('DELETE FROM kendaraan WHERE kendaraan_id = $1', [id]);
  return { message: 'Vehicle deleted successfully' };
};
