import z from 'zod'

export const currentLocationBodySchema = z.object({
  placeName: z.string(),
  macAddress: z.string(),
})