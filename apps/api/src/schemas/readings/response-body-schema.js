import { z } from 'zod'

export const createReadingBodySchema = z.object({
  m: z.string(),
  r: z.string(),
  espID: z.string(),
  placeID: z.uuid(),
  t: z.coerce.date(),
})
