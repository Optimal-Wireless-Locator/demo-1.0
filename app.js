import express from 'express'
import cors from 'cors'
import { swaggerUiMiddleware, swaggerUiSetup } from './apps/api/lib/swagger.js'
import 'dotenv/config'
import { devicesRoutes } from './apps/api/src/routes/devices.js'
import { placesRoutes } from './apps/api/src/routes/places.js'
import { locationsRoutes } from './apps/api/src/routes/locations.js'
import { readingsRoutes } from './apps/api/src/routes/readings.js'

export const app = express()

// CORS middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    credentials: true
}))

app.use('/api-docs', swaggerUiMiddleware, swaggerUiSetup)

app.use(express.json())

app.use('/', devicesRoutes)
app.use('/', placesRoutes)
app.use('/', locationsRoutes)
app.use('/', readingsRoutes)
