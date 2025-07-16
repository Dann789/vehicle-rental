import { Hono } from 'hono';
import { getRentals, getOneRental, getRentalMonth, updateRentalStatus, getRentalUser, addNewRental, updateRentalStatusById } from '../controller/rentalController';

export const rentalRoutes = new Hono();

rentalRoutes.get('/', async () => {
  return await getRentals();
});

rentalRoutes.get('/:id', async(c) => {
  const id = Number(c.req.param('id'));
  return await getOneRental(id);
})

rentalRoutes.get('/month/:month', async (c) => {
  const month = Number(c.req.param('month'));
  return await getRentalMonth(month);
})

rentalRoutes.get('/user/:id', async (c) => {
  const id = Number(c.req.param('id'));
  return await getRentalUser(id);
})

rentalRoutes.put('/update-status', async (c) => {
  await updateRentalStatus();
  return c.json({ message: 'Rental status updated successfully' });
});

rentalRoutes.put('/update-status/:id', async (c) => {
  const rental_id = Number(c.req.param('id'));
  const { status } = await c.req.json();

  const allowedStatuses = ['Disewa', 'Selesai', 'Batal', 'Menunggu'];
  if (!allowedStatuses.includes(status)) {
    return c.json({ message: 'Status tidak valid' }, 400);
  }

  await updateRentalStatusById(rental_id, status);
  return c.json({ message: 'Rental status updated successfully' });
});


rentalRoutes.post('/add', async (c) => {
  const body = await c.req.json();
  const response = await addNewRental(body);
  return response;
});


export default rentalRoutes;