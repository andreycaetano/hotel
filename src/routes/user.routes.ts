import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controller/user.controller";


export const userRoutes = Router()

const controller = container.resolve(UserController)

userRoutes.post("/register", (req, res) => controller.create(req, res))

userRoutes.post("/login", (req, res) => controller.login(req, res))

userRoutes.delete("/:id", (req, res) => controller.delete(req, res))

userRoutes.patch("/:id", (req, res) => controller.update(req, res))
