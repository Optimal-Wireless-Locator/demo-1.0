import z from 'zod'

export const createPlaceBodySchema = z.object({
  name: z.string(),
  width: z.number(),
  height: z.number(),
  propagation_factor: z.number(),
  one_meter_rssi: z.number(),
})

export const updatePlaceBodySchema = z.object({
  name: z.string().optional(),
  propagation_factor: z.number().optional(),
  one_meter_rssi: z.number().optional(),
})
