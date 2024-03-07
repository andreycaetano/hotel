"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelTimeRoutes = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const validates_middlewares_1 = require("../middleware/validates.middlewares");
const travelTime_controller_1 = require("../controller/travelTime.controller");
const travelTime_schema_1 = require("../schemas/travelTime.schema");
exports.travelTimeRoutes = (0, express_1.Router)();
const validate = tsyringe_1.container.resolve(validates_middlewares_1.Validates);
const controller = tsyringe_1.container.resolve(travelTime_controller_1.TravelTimeController);
exports.travelTimeRoutes.post("/create", (req, res, next) => validate.validateToken(req, res, next), (req, res, next) => validate.validateAdminRole(req, res, next), validate.validateBody({ body: travelTime_schema_1.travelTimeCreateSchema }), (req, res) => controller.create(req, res));
exports.travelTimeRoutes.patch("/:id", (req, res, next) => validate.validateToken(req, res, next), (req, res, next) => validate.validateAdminRole(req, res, next), validate.validateBody({ body: travelTime_schema_1.travelTimeCreateSchema }), (req, res) => controller.update(req, res));
exports.travelTimeRoutes.delete("/:id", (req, res, next) => validate.validateToken(req, res, next), (req, res, next) => validate.validateAdminRole(req, res, next), (req, res) => controller.delete(req, res));
exports.travelTimeRoutes.get("/", (req, res) => controller.get(req, res));