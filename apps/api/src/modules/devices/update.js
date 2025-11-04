import { ZodError } from 'zod'
import { prisma } from '../../../lib/prisma.js'
import { updateDeviceBodySchema } from '../../schemas/devices/response-body-schema.js'

export const updateDevice = async (req, res) => {
  try {
    const { macAddress } = req.params
    const data = updateDeviceBodySchema.parse(req.body)

    const device = await prisma.devices.findFirst({
      where: {
        mac_address: macAddress,
      },
    })

    if (!device) {
      return res.status(404).send('Device not found.')
    }

    const dataToUpdate = {}

    if (data.mac_address !== undefined) {
      dataToUpdate.mac_address = data.mac_address
    }

    if (data.name !== undefined) {
      dataToUpdate.name = data.name
    }

    if (data.mac_address === undefined && data.name === undefined) {
      return res.status(400).send('Fill in at least one field')
    }

    const updatedDevice = await prisma.devices.update({
      where: {
        mac_address: macAddress,
      },
      data: dataToUpdate,
    })

    return res.status(200).send(updatedDevice)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(`Validation error: ${err}`)
    }

    return res.status(500).send(`Internal server error: ${err}`)
  }
}
