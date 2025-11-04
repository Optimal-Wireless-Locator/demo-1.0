import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js' // Lembre do .js
import { createReadingBodySchema } from '../../schemas/readings/response-body-schema.js' // Lembre do .js

export const createReading = async (req, res) => {
  try {
    const { m, r, espID } = createReadingBodySchema.parse(req.body)

    const deviceExists = await prisma.devices.findUnique({
      where: {
        mac_address: m,
      },
    })

    if (!deviceExists) {
      return res.status(404).send('Device not found.')
    }

    const rssiInt = parseInt(String(r), 10)

    if (isNaN(rssiInt)) {
      return res.status(400).send('Invalid RSSI value.')
    }

    const newReading = await prisma.readings.create({
      data: {
        esp32: espID,
        rssi: rssiInt,
        read_at: new Date(),

        mac_address: {
          connect: {
            mac_address: m,
          },
        },
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
