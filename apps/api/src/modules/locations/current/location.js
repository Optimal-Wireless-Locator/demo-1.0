import { ZodError } from 'zod'
import { trilateration } from '../../../../lib/ml-levenberg-marquardt.js'
import { prisma } from '../../../../lib/prisma.js'
import { currentLocationBodySchema } from '../../../schemas/locations/response-body-schema.js'

export const getCurrentLocation = async (req, res) => {
  try {
    const { macAddress, placeName } = currentLocationBodySchema.parse(req.body)

    const deviceExists = await prisma.devices.findUnique({
      where: {
        mac_address: macAddress,
      },
    })

    if (!deviceExists) {
      return res.status(404).send('Device not found.')
    }

    const placeExists = await prisma.places.findUnique({
      where: {
        name: placeName,
      },
    })

    if (!placeExists) {
      return res.status(404).send('Place not found.')
    }

    const { used, x, y, place } = await trilateration(placeName, macAddress)

    await prisma.historic.create({
      data: {
        devicesMac_address: macAddress,
        x,
        y,
        place_name: place,
        calculation_inputs: JSON.stringify(used),
        tracked_at: new Date(),
      },
    })

    return res.status(200).send({
      mac_address: macAddress,
      placeName: place,
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
