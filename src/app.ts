import "express-async-errors";
import "dotenv/config";
import "reflect-metadata";
import "./container/index"
import express, { json } from "express";
import { hotelRouter } from "./routes/adminRoutes/hotel.routes";
import { HandleErrors } from "./errors/handleErrors.errors";
import { facilitiesRoutes } from "./routes/adminRoutes/facilities.routes";

export const app = express();

app.use(json());

app.use(HandleErrors.execute)

app.use("/uploads", express.static("uploads"))

app.use("/", hotelRouter)

app.use("/facilities", facilitiesRoutes)