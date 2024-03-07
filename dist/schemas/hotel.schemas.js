"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelSchema = void 0;
const zod_1 = require("zod");
exports.HotelSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().nonempty("Description is require"),
    ratingId: zod_1.z.string().nonempty("RatingId is require"),
    cityId: zod_1.z.string().nonempty("CityId is require"),
    facilitiesIds: zod_1.z.array(zod_1.z.string()),
    conditionIds: zod_1.z.array(zod_1.z.string()),
    travelTimeIds: zod_1.z.array(zod_1.z.string()),
    sportsIds: zod_1.z.array(zod_1.z.string()),
    comment: zod_1.z.string().nonempty("Comment is require")
});
