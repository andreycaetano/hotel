import { z } from "zod";

const DescriptionSchema = z.object({
    comment: z.string(),
    destination: z.string(),
    accommodation: z.string(),
    activities: z.string(),
  }); 

export const HotelSchema = z.object({
    name: z.string().min(1),
    description: DescriptionSchema,
    star: z.number().int().min(1),
    cityId: z.number().int().min(1),
    condition: z.number().int().min(1),
    travelTime: z.number().int().min(1),
    sportIds: z.array(z.number().int()),
  });