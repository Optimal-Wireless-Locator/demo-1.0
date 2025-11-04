import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js'
import { createPlaceBodySchema } from '../../schemas/places/response-body-schema.js'

export const createPlace = async (req, res) => {
  try {
    const { height, name, width, one_meter_rssi, propagation_factor } =
      createPlaceBodySchema.parse(req.body)

    const placeExists = await prisma.places.findFirst({
      where: {
        name,
      },
    })

    if (placeExists) {
      return res.status(400).send('A place with this name already exists.')
    }

    const espPositions = {
      ESP32_1: { x: 0, y: height / 2 }, // Oeste
      ESP32_2: { x: width, y: height / 2 }, // Leste
      ESP32_3: { x: width / 2, y: height }, // Norte
      ESP32_4: { x: width / 2, y: 0 }, // Sul
    }

    const newPlace = await prisma.places.create({
      data: {
        height,
        name,
        width,
        esp_positions: JSON.stringify(espPositions),
        one_meter_rssi,
        propagation_factor,
      },
    })

    return res.status(201).send(newPlace)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }

    return res.status(500).send(`Internal server error: ${err}`)
  }
}
