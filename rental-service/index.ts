import { rentalRoutes } from './src/routes/rentalRoutes';
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

app.route('/rentals', rentalRoutes);

const server = Bun.serve({
  port: 4001,
  fetch: app.fetch
});

console.log(`🚀 Rental service running at http://localhost:${server.port}`);