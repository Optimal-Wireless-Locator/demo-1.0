import { z } from 'zod'

export const createReadingBodySchema = z.object({
  m: z.string(),
  r: z.string(),
  espID: z.string(),
  t: z.string(),
})
