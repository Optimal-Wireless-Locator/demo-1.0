import { ZodError } from 'zod'
import { trilateration } from '../../../../lib/ml-levenberg-marquardt.js'
import { prisma } from '../../../../lib/prisma.js'
import { currentLocationBodySchema } from '../../../schemas/locations/response-body-schema.js'

export const getCurrentLocation = async (req, res) => {
  try {
    const { macAddress, placeName } = currentLocationBodySchema.parse(req.body)

    const device = await prisma.devices.findUnique({
      where: {
        mac_address: macAddress,
      },
    })

    if (!device) {
      return res.status(404).send('Device not found.')
    }

    const place = await prisma.places.findUnique({
      where: {
        name: placeName,
      },
    })

    if (!place) {
      return res.status(404).send('Place not found.')
    }

    const { used, x, y } = await trilateration(placeName, macAddress)

    await prisma.historic.create({
      data: {
        devicesMac_address: macAddress,
        x,
        y,
        calculation_inputs: JSON.stringify(used),
        tracked_at: new Date(),
      },
    })

    return res.status(200).send({
      mac_address: macAddress,
      x,
      y,
      used_sensors: used,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }

    return res.status(500).send(`Internal server error: ${err}`)
  }
}
