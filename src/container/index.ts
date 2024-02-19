import { container } from "tsyringe";
import { HotelServices } from "../services/hotel.services";
import { UserServices } from "../services/user.services";
import { AddressServices } from "../services/address.services";
import { FacilitiesServices } from "../services/facilities.services";

container.registerSingleton("HotelServices", HotelServices)
container.registerSingleton("UserServices", UserServices)
container.registerSingleton("AddressServices", AddressServices)
container.registerSingleton("FacilitiesServices", FacilitiesServices)