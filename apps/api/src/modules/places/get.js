import { prisma } from '../../../lib/prisma.js'

export const getPlace = async (req, res) => {
  try {
    const { name } = req.params

    const place = await prisma.places.findUnique({
      where: {
        name,
      },
    })

    if (!place) {
      return res.status(404).send('Place not found.')
    }

    return res.status(200).send(place)
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
