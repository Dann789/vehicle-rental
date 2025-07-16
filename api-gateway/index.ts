import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRoutes from '../user-service/src/routes/userRoutes'
import {vehicleRoutes} from '../vehicle-service/src/routes/vehicleRoutes'
import rentalRoutes from '../rental-service/src/routes/rentalRoutes'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}))

app.route('/users', userRoutes)
app.route('/vehicles', vehicleRoutes)
app.route('/rentals', rentalRoutes)

Bun.serve({
  port: 8000,
  fetch: app.fetch
})

console.log('✅ API Gateway running at http://localhost:8000')
