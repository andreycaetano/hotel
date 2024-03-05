import { z } from "zod";


export const HotelSchema = z.object({
  name: z.string(),
  description: z.object({
    destination: z.string().nonempty("Destination is require"),
    accommodation: z.string().nonempty("Accommodation is require"),
    activities: z.string().nonempty("Activities is require")
  }),
  ratingId: z.string().nonempty("RatingId is require"),
  cityId: z.string().nonempty("CityId is require"),
  facilitiesIds: z.array(z.string()),
  conditionIds: z.array(z.string()),
  travelTimeIds: z.array(z.string()),
  sportsIds: z.array(z.string()),
  comment: z.object({
    author: z.string(),
    comment: z.string()
  })
});