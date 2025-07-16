import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';

import {
  getVehicles,
  getVehicle,
  createVehicleHandler,
  updateVehicleHandler,
  deleteVehicleHandler,
  getCarCount,
  getBusCount,
  getElfCount,
  getMotorCount,
} from '../controller/vehicleController';

const vehicleRoutes = new Hono();

// GET /vehicles
vehicleRoutes.get('/', async (c) => {
  return await getVehicles();
});

// GET /vehicles/mobil
vehicleRoutes.get('/mobil', async (c) => {
  return await getCarCount();
});

// GET /vehicles/bis
vehicleRoutes.get('/bis', async (c) => {
  return await getBusCount();
});

// GET /vehicles/elf
vehicleRoutes.get('/elf', async (c) => {
  return await getElfCount();
});

// GET /vehicles/motor
vehicleRoutes.get('/motor', async (c) => {
  return await getMotorCount();
});

vehicleRoutes.get('/:id', async (c) => {
  const idParam = c.req.param('id');
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return new Response(
      JSON.stringify({
        message: 'Invalid vehicle id',
        detail: `Parameter id harus angka. Diterima: ${idParam}`
      }),
      { status: 400 }
    );
  }

  return await getVehicle(id);
});

// POST /vehicles/add
vehicleRoutes.post('/add', async (c) => {
  const formData = await c.req.formData();

  const nama = formData.get('nama') as string;
  const tipe = formData.get('tipe') as string;
  const plat_nomor = formData.get('plat_nomor') as string;
  const harga_sewa_per_hari = Number(formData.get('harga_sewa_per_hari'));

  let foto_url = null;

  const fotoFile = formData.get('foto_url');

  if (fotoFile && fotoFile instanceof File) {
    const buffer = Buffer.from(await fotoFile.arrayBuffer());

    // buat folder uploads jika belum ada
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
    }

    const filename = `${Date.now()}-${fotoFile.name}`;
    const filepath = path.join('./uploads', filename);

    await fs.promises.writeFile(filepath, buffer);

    foto_url = `/uploads/${filename}`;
  }

  const body = {
    nama,
    tipe,
    plat_nomor,
    harga_sewa_per_hari,
    tersedia: true,
    foto_url,
  };

  return await createVehicleHandler(body);
});

// PUT /vehicles/:id
vehicleRoutes.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  const formData = await c.req.formData();

  // Ambil data dari formData
  const nama = formData.get('nama') as string | null;
  const tipe = formData.get('tipe') as string | null;
  const plat_nomor = formData.get('plat_nomor') as string | null;
  const tersedia = formData.get('tersedia') === 'true' || false;
  const harga_sewa_per_hari_raw = formData.get('harga_sewa_per_hari');
  const harga_sewa_per_hari = harga_sewa_per_hari_raw !== null
    ? Number(harga_sewa_per_hari_raw)
    : null;

  let foto_url = formData.get('foto_url') as string | null;

  const fotoFile = formData.get('foto_url');

  if (fotoFile && fotoFile instanceof File) {
    const buffer = Buffer.from(await fotoFile.arrayBuffer());

    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
    }

    const filename = `${Date.now()}-${fotoFile.name}`;
    const filepath = path.join('./uploads', filename);

    await fs.promises.writeFile(filepath, buffer);

    foto_url = `/uploads/${filename}`;
  }

  const body = {
    nama,
    tipe,
    plat_nomor,
    harga_sewa_per_hari,
    tersedia,
    foto_url,
  };

  return await updateVehicleHandler(id, body);
});


// DELETE /vehicles/:id
vehicleRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  return await deleteVehicleHandler(id);
});

export { vehicleRoutes };
