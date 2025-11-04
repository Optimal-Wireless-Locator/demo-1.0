import { prisma } from '../../../lib/prisma.js'

export const getAllPlaces = async (_, res) => {
  try {
    const places = await prisma.places.findMany()

    return res.status(200).send(places)
  } catch (err) {
    return res.status(500).send(`Internal server error: ${err}`)
  }
}
