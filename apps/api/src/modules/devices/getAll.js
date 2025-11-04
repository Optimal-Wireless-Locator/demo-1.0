import { prisma } from '../../../lib/prisma.js'

export const getAllDevices = async (_, res) => {
  try {
    const devices = await prisma.devices.findMany()

    return res.status(200).send(devices)
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
