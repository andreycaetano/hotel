"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.RatingServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const appError_erros_1 = require("../errors/appError.erros");
let RatingServices = class RatingServices {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.ratings.findFirst({
                where: {
                    rating: {
                        equals: data.rating.toLowerCase()
                    }
                }
            });
            if (find)
                throw new appError_erros_1.AppError(409, "Rating alread create");
            const create = yield database_1.prisma.ratings.create({
                data: {
                    rating: data.rating
                }
            });
            return create;
        });
    }
    update(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.ratings.findFirst({
                where: { id: id }
            });
            if (!find)
                throw new appError_erros_1.AppError(404, "Rating not found.");
            const updated = yield database_1.prisma.ratings.update({
                where: { id: id },
                data: {
                    rating: data.rating
                }
            });
            return updated;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const get = yield database_1.prisma.ratings.findMany();
            return get;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.ratings.findFirst({
                where: { id: id }
            });
            if (!find)
                throw new appError_erros_1.AppError(404, "Rating not found");
            yield database_1.prisma.ratings.delete({
                where: { id: id }
            });
        });
    }
};
exports.RatingServices = RatingServices;
exports.RatingServices = RatingServices = __decorate([
    (0, tsyringe_1.injectable)()
], RatingServices);
