import { Router } from "express";
import { upload } from "../../config/multer.config";
import { container } from "tsyringe";
import { HotelController } from "../../controller/hotel.controller";

export const hotelRouter = Router();

const controller = container.resolve(HotelController);

hotelRouter.post("/create", upload.array('image'), (req, res) => controller.create(req, res));

hotelRouter.get("/hotels", (req, res) => controller.getAll(req, res));

hotelRouter.patch("/:id", (req, res) => controller.update(req, res));

hotelRouter.delete("/:id", (req, res) => controller.delete(req, res));