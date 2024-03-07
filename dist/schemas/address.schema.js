"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateSchema = exports.countrySchema = void 0;
const zod_1 = require("zod");
exports.countrySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name is require.")
});
exports.stateSchema = exports.countrySchema.extend({
    countryId: zod_1.z.number().min(1)
});
