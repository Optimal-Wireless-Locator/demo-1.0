import { prisma } from '../../../lib/prisma.js'

export const deleteDevice = async (req, res) => {
  try {
    const { macAddress } = req.params

    const device = await prisma.devices.findUnique({
      where: {
        mac_address: macAddress,
      },
    })

    if (!device) {
      return res.status(404).send('Device not found.')
    }

    await prisma.devices.delete({
      where: {
        mac_address: macAddress,
      },
    })

    return res.status(204).send()
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
