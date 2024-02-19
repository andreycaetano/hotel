import { Router } from "express";
import { upload } from "../config/multer.config";
import { container } from "tsyringe";
import { HotelController } from "../controller/hotel.controller";
import { Validates } from "../middleware/validates.middlewares";
import { createHotelSchema } from "../schemas/hotel.schemas";

export const hotelRouter = Router();

const controller = container.resolve(HotelController);
const validates = container.resolve(Validates)

hotelRouter.post("/create", (req, res, next) => validates.validateToken(req, res, next),validates.validateBody({body: createHotelSchema}), upload.array('image'), (req, res) => controller.create(req, res));
hotelRouter.patch("/:id", (req, res, next) => validates.validateToken(req, res, next), (req, res) => controller.update(req, res));
hotelRouter.delete("/:id", (req, res, next) => validates.validateToken(req, res, next), (req, res) => controller.delete(req, res));

hotelRouter.get("/hotels/:id", (req, res) => controller.getAll(req, res));

