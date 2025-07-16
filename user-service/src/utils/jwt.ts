import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode('supersecret');
const alg = 'HS256';

export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (e) {
    return null;
  }
}
