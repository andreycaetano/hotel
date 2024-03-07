"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportCreateSchema = void 0;
const zod_1 = require("zod");
exports.sportCreateSchema = zod_1.z.object({
    name: zod_1.z.string()
});
