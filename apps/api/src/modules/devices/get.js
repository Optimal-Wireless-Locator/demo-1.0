import { prisma } from '../../../lib/prisma.js'

export const getDevice = async (req, res) => {
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

    return res.status(200).send(device)
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
