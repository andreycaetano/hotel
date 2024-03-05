import { Router } from "express";
import { container } from "tsyringe";
import { GaleryController } from "../controller/galery.controller";
import { upload } from "../config/multer.config";

export const galeryRoutes = Router()
const controller = container.resolve(GaleryController)

galeryRoutes.post("/create",
    upload.fields([{name: "galery"}]),
    (req, res) => controller.create(req, res)
)

galeryRoutes.delete("/:id",
    (req, res) => controller.delete(req, res)
)