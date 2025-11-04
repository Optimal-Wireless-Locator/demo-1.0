import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js'
import { createDeviceBodySchema } from '../../schemas/devices/response-body-schema.js'

export const createDevice = async (req, res) => {
  try {
    const { mac_address, name } = createDeviceBodySchema.parse(req.body)

    const deviceExists = await prisma.devices.findFirst({
      where: {
        mac_address,
      },
    })

    if (deviceExists) {
      return res
        .status(400)
        .send('A device with this MAC Adress already exists.')
    }

    const newDevice = await prisma.devices.create({
      data: {
        mac_address,
        name,
      },
    })

    return res.status(201).send(newDevice)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }

    return res.status(500).send(`Internal server error: ${err}`)
  }
}
