import type { Rental } from '../models/rentalModel';
import { addRental, getAllRentals, getRentalById, getRentalByMonth, getRentalByUser, updateRentalStatusAll, updateOneRental } from '../services/rentalService';

export const getRentals = async (): Promise<Response> => {
  const rentals = await getAllRentals();
  return Response.json(rentals);
};

export const getOneRental = async (id: number): Promise<Response> => {
  const rental = await getRentalById(id);
  return Response.json(rental);
};

export const getRentalMonth = async (month:number) => {
  const rentals = await getRentalByMonth(month);
  return Response.json({ rentals });
};

export const getRentalUser = async (user_id: number): Promise<Response> => {
  const rentals = await getRentalByUser(user_id);
  return Response.json(rentals);
};

export const updateRentalStatus = async (): Promise<Response> => {
  const result = await updateRentalStatusAll();
  return Response.json(result);
};

export const updateRentalStatusById = async (rental_id: number, status: string): Promise<Response> => {
  const result = await updateOneRental(rental_id, status);
  return Response.json(result);
};


export const addNewRental = async (rental: Rental): Promise<Response> => {
  const rentalWithStatus = {
    ...rental,
    status: 'Menunggu',       // ⬅️ default di controller
  };

  const result = await addRental(rentalWithStatus);
  return Response.json(result);
};