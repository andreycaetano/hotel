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
exports.AddressServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const appError_erros_1 = require("../errors/appError.erros");
let AddressServices = class AddressServices {
    createCountry(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const create = yield database_1.prisma.country.create({
                data: {
                    name: data.name
                }
            });
            return create;
        });
    }
    updateCountry(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield database_1.prisma.country.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name
                },
                include: {
                    cities: true
                }
            });
            return updated;
        });
    }
    getCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            const get = yield database_1.prisma.country.findMany({
                include: {
                    cities: true
                }
            });
            return get;
        });
    }
    deleteCountry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findCountry = yield database_1.prisma.country.findFirst({ where: { id: id } });
            if (!findCountry) {
                throw new appError_erros_1.AppError(404, "Country not found");
            }
            const citiesWithHotels = yield database_1.prisma.cities.findMany({
                where: {
                    countryId: id,
                    hotel: {
                        some: {}
                    }
                }
            });
            if (citiesWithHotels.length != 0) {
                throw new appError_erros_1.AppError(400, "This country cannot be deleted. There are cities linked to hotels.");
            }
            yield database_1.prisma.country.delete({ where: { id } });
        });
    }
    createCity(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const create = yield database_1.prisma.cities.create({
                data: {
                    name: data.name,
                    country: {
                        connect: { id: data.countryId }
                    }
                },
                include: {
                    country: true
                }
            });
            const refactoryReturn = {
                id: create.id,
                name: create.name,
                country: create.country
            };
            return refactoryReturn;
        });
    }
    updateCity(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findCity = yield database_1.prisma.cities.findFirst({ where: { id: id } });
            if (!findCity) {
                throw new appError_erros_1.AppError(404, "City not found.");
            }
            const updated = yield database_1.prisma.cities.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    countryId: {
                        set: data.countryId
                    }
                },
                include: {
                    country: true
                }
            });
            const refactoryReturn = {
                id: updated.id,
                name: updated.name,
                country: updated.country
            };
            return refactoryReturn;
        });
    }
    deleteCity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityWithHotels = yield database_1.prisma.cities.findFirst({
                where: {
                    id: id
                },
                include: {
                    hotel: true
                }
            });
            if (!cityWithHotels)
                throw new appError_erros_1.AppError(404, "City not found.");
            if (cityWithHotels.hotel.length != 0)
                throw new appError_erros_1.AppError(400, "This city cannot be deleted. It is linked to hotels.");
            yield database_1.prisma.cities.delete({
                where: {
                    id: id
                }
            });
        });
    }
    getCities() {
        return __awaiter(this, void 0, void 0, function* () {
            const cities = yield database_1.prisma.cities.findMany({
                include: {
                    country: true
                }
            });
            return cities;
        });
    }
};
exports.AddressServices = AddressServices;
exports.AddressServices = AddressServices = __decorate([
    (0, tsyringe_1.injectable)()
], AddressServices);
