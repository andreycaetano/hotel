import { z } from "zod";

export const sportCreateSchema = z.object({
    name: z.string()
})