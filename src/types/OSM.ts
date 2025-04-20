import { z } from 'zod'

export const OSMLocation = z.object({
  osm_type: z.string(),
  lat: z.string(),
  lon: z.string(),
  display_name: z.string(),
  class: z.string(),
  type: z.string(),
  importance: z.number(),
  address: z.object({ country: z.string() }),
})

export const OSMLocationArr = z.array(OSMLocation)

export type OSMLocation = z.infer<typeof OSMLocation>
export type OSMLocationArr = z.infer<typeof OSMLocationArr>
