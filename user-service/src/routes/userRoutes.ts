import { Hono } from 'hono';
import { getUsers, createUser, deleteUser, handleLogin } from '../controller/userController';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

export const userRoutes = new Hono();

userRoutes.get('/', async (c) => {
    return await getUsers();
});

userRoutes.post('/add', async (c) => {
  const body = await c.req.json();
  return await createUser(body);
});

userRoutes.put('/edit/:id', async (c) => {
  const userId = Number(c.req.param('id'));
  const body = await c.req.json();

  let hashedPassword: string | undefined = undefined;

  if (body.password && body.password.trim() !== '') {
    hashedPassword = await bcrypt.hash(body.password, 10);
  }

  const oldUser = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );

  if (oldUser.rowCount === 0) {
    return c.json({ message: 'User not found' }, 404);
  }

  const passwordToSave = hashedPassword ?? oldUser.rows[0].password;

  const result = await pool.query(
    `UPDATE users
     SET nama = $1, role_id = $2, email = $3, password = $4, no_telp = $5
     WHERE user_id = $6
     RETURNING user_id, nama, role_id, email, no_telp`,
    [
      body.nama,
      body.role_id,
      body.email,
      passwordToSave,
      body.no_telp,
      userId
    ]
  );

  return c.json(result.rows[0]);
});


userRoutes.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    return await deleteUser(id);
});

userRoutes.post('/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  const result = await handleLogin(email, password);
  return result;
});

export default userRoutes;