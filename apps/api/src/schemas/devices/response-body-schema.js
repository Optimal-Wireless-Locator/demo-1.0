import z from 'zod'

export const createDeviceBodySchema = z.object({
  mac_address: z.string(),
  name: z.string(),
})

export const updateDeviceBodySchema = z.object({
  mac_address: z.string().optional(),
  name: z.string().optional(),
})
