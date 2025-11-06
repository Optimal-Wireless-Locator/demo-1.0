import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js'
import { updatePlaceBodySchema } from '../../schemas/places/response-body-schema.js'

export const updatePlace = async (req, res) => {
  try {
    const { name } = req.params
    const data = updatePlaceBodySchema.parse(req.body)

    const place = await prisma.places.findFirst({
      where: {
        name,
      },
    })

    if (!place) {
      return res.status(404).send('Place not found.')
    }

    const dataToUpdate = {}

    if (data.name !== undefined) {
      dataToUpdate.name = data.name
    }

    if (data.width !== undefined) {
      dataToUpdate.width = data.width
    }

    if (data.height !== undefined) {
      dataToUpdate.height = data.height
    }

    if (data.one_meter_rssi !== undefined) {
      dataToUpdate.one_meter_rssi = data.one_meter_rssi
    }

    if (data.propagation_factor !== undefined) {
      dataToUpdate.propagation_factor = data.propagation_factor
    }

    if ( data === undefined ) {
      return res.status(400).send('Fill in at least one field')
    }

    const updatedPlace = await prisma.places.update({
      where: {
        name,
      },
      data: dataToUpdate,
    })

    return res.status(200).send(updatedPlace)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }

    return res.status(500).send(`Internal server error: ${err}`)
  }
}
