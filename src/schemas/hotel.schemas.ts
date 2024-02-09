import { z } from "zod";

export const hotelSchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    facilities: z.array(z.number()),
    images: z.array(z.number())
})