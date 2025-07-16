import { pool } from '../db/index';
import type { Rental } from '../models/rentalModel';

export const getAllRentals = async () => {
  const result = await pool.query(`
    SELECT * FROM rental
    ORDER BY rental_id DESC
  `);
  return result.rows;
};

export const getRentalById = async (id: number): Promise<Rental | null> => {
  const result = await pool.query('SELECT * FROM rental WHERE rental_id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getRentalByMonth = async (month: number) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM rental WHERE EXTRACT(MONTH FROM start_date) = $1`,
    [month]
  );
  return Number(result.rows[0].count);
};

export const getRentalByUser = async (user_id: number) => {
  const result = await pool.query(
    `SELECT * FROM rental WHERE user_id = $1 ORDER BY rental_id DESC`,
    [user_id]
  );
  return result.rows;
}

export const updateRentalStatusAll = async (): Promise<Rental> => {
  const result = await pool.query(`
    UPDATE rental
    SET status = 'Selesai'
    WHERE status = 'Disewa'
    AND end_date < CURRENT_DATE
  `,);
  return result.rows[0];
};

export const updateOneRental = async (rental_id: number, status: string): Promise<Rental> => {
  const result = await pool.query(`
    UPDATE rental
    SET status = $1
    WHERE rental_id = $2
    RETURNING *
  `, [status, rental_id]);

  return result.rows[0];
};


export const addRental = async (rental: Rental) => {
  const result = await pool.query(`
    INSERT INTO rental (user_id, kendaraan_id, start_date, end_date, total_harga, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [rental.user_id, rental.kendaraan_id, rental.start_date, rental.end_date, rental.total_harga, rental.status]);
  return result.rows[0];
}