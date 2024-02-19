import { z } from "zod";

const addressSchema = z.object({
    countryId: z.number().min(0, "Country is require."),
    stateId: z.number().min(1, "State is require.")
})

const descriptionSchema = z.object({
    comment: z.string().min(1, "Comment is require."),
    destination: z.string().min(1, "Destination is require."),
    accommodation: z.string().min(1, "Accommodation is require."),
    activities: z.string().min(1, "Activities is require.")
})

export const createHotelSchema = z.object({
    name: z.string().min(1, "Name is require.").max(255),
    star: z.number().min(0, "Star is require.").max(5),
    description: descriptionSchema,
    address: addressSchema,
    facilities: z.array(z.number()).optional()
})