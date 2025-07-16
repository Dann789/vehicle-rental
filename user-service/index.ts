import { userRoutes } from './src/routes/userRoutes';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.fire();

app.route('/users', userRoutes);

const server = Bun.serve({
  port: 4000,
  fetch: app.fetch
});

console.log(`🚀 User service running at http://localhost:${server.port}`);
