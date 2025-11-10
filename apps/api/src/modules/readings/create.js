import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js'
import { createReadingBodySchema } from '../../schemas/readings/response-body-schema.js'

export const createReading = async (req, res) => {
  try {
    const { m, r, espID, placeID, t } = createReadingBodySchema.parse(req.body)

    const deviceExists = await prisma.devices.findUnique({
      where: {
        mac_address: m,
      },
    })

    if (!deviceExists) {
      return res.status(404).send('Device not found.')
    }

    const place = await prisma.places.findUnique({
      where: {
        id: placeID,
      },
    })

    if (!place) {
      return res.status(404).send('Place not found.')
    }

    const rssiInt = parseInt(String(r), 10)

    if (isNaN(rssiInt)) {
      return res.status(400).send('Invalid RSSI value.')
    }

    await prisma.devices.update({
      where: {
        mac_address: m,
      },
      data: {
        last_read: t,
      }
    })

    const newReading = await prisma.readings.create({
      data: {
        esp32: espID,
        place_name: place.name,
        rssi: rssiInt,
        read_at: t,
        devicesMac_address: deviceExists.mac_address,
      },
    })

    return res.status(201).send(newReading)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
