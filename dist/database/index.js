"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCondition = yield exports.prisma.conditions.findMany();
    if (existingCondition.length === 0) {
        yield exports.prisma.conditions.createMany({
            data: [
                { condition: "All inclusive" },
                { condition: "Half board" },
                { condition: "Full board" },
                { condition: "Bed and breakfast" }
            ]
        });
    }
    const existingTravelTime = yield exports.prisma.travelTime.findMany();
    if (existingTravelTime.length === 0) {
        yield exports.prisma.travelTime.createMany({
            data: [
                { travelTime: "3 day" },
                { travelTime: "4 day" },
                { travelTime: "More than 5 day" }
            ]
        });
    }
    const existingSports = yield exports.prisma.sports.findMany();
    if (existingSports.length === 0) {
        yield exports.prisma.sports.createMany({
            data: [
                { sport: "Football" },
                { sport: "Hockey" },
                { sport: "Athletics" },
                { sport: "Padel" }
            ]
        });
    }
    const existingUser = yield exports.prisma.user.findMany();
    if (existingUser.length === 0) {
        yield exports.prisma.user.create({
            data: {
                email: "admin@mail.com",
                username: "admin",
                password: "admin",
                role: "admin"
            }
        });
    }
    const existingRatings = yield exports.prisma.ratings.findMany();
    if (existingRatings.length === 0) {
        yield exports.prisma.ratings.createMany({
            data: [
                { rating: "1 Star" },
                { rating: "2 Stars" },
                { rating: "3 Stars" },
                { rating: "4 Stars" },
                { rating: "5 Stars" },
            ]
        });
    }
});
exports.main = main;
