import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { vehicleRoutes } from './src/routes/vehicleRoutes';
import { serveStatic } from 'hono/bun';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.route('/vehicles', vehicleRoutes);

app.fire();

app.use('/uploads/*', serveStatic({ root: './' }));

Bun.serve({
  port: 5000,
  fetch: app.fetch
});

console.log('✅ Vehicle Service running on http://localhost:5000');
