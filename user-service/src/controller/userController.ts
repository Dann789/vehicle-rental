import { getAllUsers, createNewUser, editUser, removeUser, handleLoginUser } from '../services/userService';
import { generateToken } from '../utils/jwt';

export const getUsers = async (): Promise<Response> => {
  const users = await getAllUsers();
  return Response.json(users);
};

export const createUser = async (body: any): Promise<Response> => {
  const result = await createNewUser(body);
  return new Response(
    JSON.stringify({
      message: 'User created successfully',
      user: result,
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const updateUser = async (user_id: number, body: any): Promise<Response> => {
  const result = await editUser(user_id, body.nama, body.role_id, body.email, body.password, body.no_telp);
  return Response.json(result);
};

export const deleteUser = async (user_id: number): Promise<Response> => {
  const result = await removeUser(user_id);
  return Response.json(result);
};

export const handleLogin = async (email: string, password: string) => {
  const user = await handleLoginUser(email, password);
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'Invalid email or password' }),
      { status: 401 }
    );
  }

  const token = await generateToken({
    user_id: user.user_id,
    email: user.email,
  });

  return new Response(
    JSON.stringify({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        nama: user.nama,
        role: user.role_id,
      },
    }),
    { status: 200 }
  );
};

