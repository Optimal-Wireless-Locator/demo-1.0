import express from 'express'
import { swaggerUiMiddleware, swaggerUiSetup } from './apps/api/lib/swagger.js'
import 'dotenv/config'
import { devicesRoutes } from './apps/api/src/routes/devices.js'
import { placesRoutes } from './apps/api/src/routes/places.js'
import { locationsRoutes } from './apps/api/src/routes/locations.js'
import { readingsRoutes } from './apps/api/src/routes/readings.js'

export const app = express()

app.use('/api-docs', swaggerUiMiddleware, swaggerUiSetup)

app.use(express.json())

app.use('/', devicesRoutes)
app.use('/', placesRoutes)
app.use('/', locationsRoutes)
app.use('/', readingsRoutes)
