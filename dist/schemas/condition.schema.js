"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionCreateSchema = void 0;
const zod_1 = require("zod");
exports.conditionCreateSchema = zod_1.z.object({
    condition: zod_1.z.string()
});
