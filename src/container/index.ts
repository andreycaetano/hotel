import { container } from "tsyringe";
import { HotelServices } from "../services/hotel.services";

container.registerSingleton("HotelServices", HotelServices)