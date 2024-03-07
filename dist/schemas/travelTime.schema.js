"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelTimeCreateSchema = void 0;
const zod_1 = require("zod");
exports.travelTimeCreateSchema = zod_1.z.object({
    travelTime: zod_1.z.string()
});
