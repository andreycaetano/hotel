import { z } from "zod";
import { hotelSchema } from "../schemas/hotel.schemas";

export type THotel = z.infer<typeof hotelSchema>;

export interface IImage {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}