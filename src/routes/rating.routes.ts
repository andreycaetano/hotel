import { Router } from "express";
import { container } from "tsyringe";
import { RatingController } from "../controller/rating.controller";

export const ratingRoutes = Router()

const controller = container.resolve(RatingController)

ratingRoutes.post("/create",
    (req, res) => controller.create(req, res)
)

ratingRoutes.patch("/:id",
    (req, res) => controller.update(req, res)
)

ratingRoutes.get("/",
    (req, res) => controller.get(req, res)
)

ratingRoutes.delete("/:id",
    (req, res) => controller.delete(req, res)
)