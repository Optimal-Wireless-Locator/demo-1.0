import { prisma } from '../../../../lib/prisma.js'

export const getHistoricLocation = async (req, res) => {
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

    const historic = await prisma.historic.findMany({
      where: { devicesMac_address: macAddress },
      orderBy: { tracked_at: 'asc' },
    })

    const parsedHistoric = historic.map((record) => {
      let parsedInputs = null

      if (record.calculation_inputs) {
        try {
          parsedInputs = JSON.parse(record.calculation_inputs)
        } catch (err) {
          console.error('failure to parse JSON:', err)
        }
      }

      return {
        ...record,
        calculation_inputs: parsedInputs,
      }
    })
    
    return res.status(200).send(parsedHistoric)
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
