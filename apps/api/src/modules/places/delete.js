import { prisma } from '../../../lib/prisma.js'

export const deletePlace = async (req, res) => {
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

    await prisma.places.delete({
      where: {
        name,
      },
    })

    return res.status(204).send()
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
