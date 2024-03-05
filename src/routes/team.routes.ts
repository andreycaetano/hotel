import { Router } from "express";
import { container } from "tsyringe";
import { TeamController } from "../controller/team.controller";
import { upload } from "../config/multer.config";

export const teamRouter = Router()

const controller = container.resolve(TeamController)

teamRouter.post("/create", 
    upload.fields([{name: "team", maxCount: 1}]),
    (req, res) => controller.create(req, res)
)

teamRouter.patch("/:id", 
    upload.fields([{name: "team", maxCount: 1}]),
    (req, res) => controller.update(req, res)
)

teamRouter.get("/", 
    (req, res) => controller.get(req, res)
)

teamRouter.delete("/:id", 
    (req, res) => controller.delete(req, res)
)