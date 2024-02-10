import { container } from "tsyringe";
import { HotelServices } from "../services/hotel.services";
import { UserServices } from "../services/user.services";

container.registerSingleton("HotelServices", HotelServices)
container.registerSingleton("UserServices", UserServices)