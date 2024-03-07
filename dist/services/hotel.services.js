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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const fs_1 = __importDefault(require("fs"));
const appError_erros_1 = require("../errors/appError.erros");
let HotelServices = class HotelServices {
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const photos = req.files;
            if (!photos) {
                throw new appError_erros_1.AppError(404, "Photos are required.");
            }
            const data = req.body;
            const parsedData = Object.assign(Object.assign({}, data), { facilitiesIds: JSON.parse(data.facilitiesIds), conditionIds: JSON.parse(data.conditionIds), travelTimeIds: JSON.parse(data.travelTimeIds), sportsIds: JSON.parse(data.sportsIds), description: JSON.parse(data.description), comment: JSON.parse(data.comment) });
            const cityId = Number(parsedData.cityId);
            const ratingId = Number(parsedData.ratingId);
            const [findCity, conditions, travelTimes, facilities, sport] = yield Promise.all([
                database_1.prisma.cities.findUnique({ where: { id: cityId } }),
                database_1.prisma.conditions.findMany({ where: { id: { in: parsedData.conditionIds } } }),
                database_1.prisma.travelTime.findMany({ where: { id: { in: parsedData.travelTimeIds } } }),
                database_1.prisma.facilities.findMany({ where: { id: { in: parsedData.facilitiesIds } } }),
                database_1.prisma.sports.findMany({ where: { id: { in: parsedData.sportsIds } } })
            ]);
            if (!findCity) {
                throw new appError_erros_1.AppError(404, "City not found");
            }
            const photosHotel = photos.hotel.map(photo => ({ path: photo.path }));
            const created = yield database_1.prisma.hotel.create({
                data: {
                    name: parsedData.name,
                    description: {
                        create: {
                            accommodation: parsedData.description.accommodation,
                            activities: parsedData.description.activities,
                            comment: {
                                create: {
                                    author: parsedData.comment.author,
                                    comment: parsedData.comment.comment,
                                    photo: photos.authors[0].path
                                }
                            },
                            destination: parsedData.description.destination
                        }
                    },
                    rating: { connect: { id: ratingId } },
                    images: { createMany: { data: photosHotel } },
                    city: { connect: { id: cityId } },
                    facilities: { connect: facilities.map(facility => ({ id: facility.id })) },
                    condition: { connect: conditions.map(condition => ({ id: condition.id })) },
                    travelTime: { connect: travelTimes.map(travelTime => ({ id: travelTime.id })) },
                    sport: { connect: sport.map(sport => ({ id: sport.id })) },
                },
                include: {
                    city: { include: { country: true } },
                    facilities: true,
                    description: true,
                    sport: true,
                    condition: true,
                    travelTime: true,
                    rating: true
                }
            });
            return created;
        });
    }
    get(id, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let hotels;
            try {
                if (id) {
                    const hotel = yield database_1.prisma.hotel.findFirst({
                        where: { id: id },
                        include: this.includeRelations()
                    });
                    if (!hotel) {
                        throw new appError_erros_1.AppError(404, "Hotel not found.");
                    }
                    hotels = [hotel];
                }
                else {
                    const whereClause = this.buildWhereClause(filters);
                    hotels = yield database_1.prisma.hotel.findMany({
                        where: whereClause,
                        include: this.includeRelations()
                    });
                }
                return hotels;
            }
            catch (error) {
                throw new appError_erros_1.AppError(500, "Internal Server Error");
            }
        });
    }
    includeRelations() {
        return {
            facilities: true,
            description: true,
            city: { include: { country: true } },
            sport: true,
            condition: true,
            travelTime: true,
            images: true,
        };
    }
    buildWhereClause(filters) {
        const where = {};
        if (filters) {
            if (filters.name) {
                where['name'] = { contains: filters.name.toLowerCase(), mode: "insensitive" };
            }
            if (filters.rating) {
                where['ratingId'] = { in: filters.rating.split(',').map((id) => parseInt(id)) };
            }
            if (filters.city) {
                where['cityId'] = { in: filters.city.split(',').map((id) => parseInt(id)) };
            }
            if (filters.condition) {
                where['condition'] = { some: { id: { in: filters.condition.split(',').map((id) => parseInt(id)) } } };
            }
            if (filters.travelTime) {
                where['travelTime'] = { some: { id: { in: filters.travelTime.split(',').map((id) => parseInt(id)) } } };
            }
            if (filters.sport) {
                where['sport'] = { some: { id: { in: filters.sport.split(',').map((id) => parseInt(id)) } } };
            }
            if (filters.country) {
                where['city'] = { countryId: { in: filters.country.split(',').map((id) => parseInt(id)) } };
            }
            if (filters.facilities) {
                where['facilities'] = { some: { id: { in: filters.facilities.split(',').map((id) => parseInt(id)) } } };
            }
        }
        return where;
    }
    update(id, req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const photos = req.files;
            const data = req.body;
            data.facilitiesIds = JSON.parse(data.facilitiesIds);
            data.conditionIds = JSON.parse(data.conditionIds);
            data.travelTimeIds = JSON.parse(data.travelTimeIds);
            data.sportsIds = JSON.parse(data.sportsIds);
            data.description = JSON.parse(data.description);
            data.comment = JSON.parse(data.comment);
            const findHotel = yield database_1.prisma.hotel.findUnique({
                where: { id },
                include: {
                    images: true,
                    description: { include: { comment: true } },
                }
            });
            if (!findHotel) {
                throw new appError_erros_1.AppError(404, "Hotel not found");
            }
            const findCity = yield database_1.prisma.cities.findUnique({
                where: { id: Number(data.cityId) }
            });
            if (!findCity) {
                throw new appError_erros_1.AppError(404, "City not found");
            }
            const conditions = yield database_1.prisma.conditions.findMany({
                where: {
                    id: {
                        in: data.conditionIds
                    }
                }
            });
            const travelTimes = yield database_1.prisma.travelTime.findMany({
                where: {
                    id: {
                        in: data.travelTimeIds
                    }
                }
            });
            const facilities = yield database_1.prisma.facilities.findMany({
                where: { id: { in: data.facilitiesIds } }
            });
            const sports = yield database_1.prisma.sports.findMany({
                where: { id: { in: data.sportsIds } }
            });
            const updatedHotel = yield database_1.prisma.hotel.update({
                where: { id },
                data: {
                    name: data.name,
                    description: {
                        update: {
                            accommodation: data.description.accommodation,
                            activities: data.description.activities,
                            comment: {
                                update: {
                                    author: data.comment.author,
                                    photo: (photos === null || photos === void 0 ? void 0 : photos.authors[0].path) || ((_a = findHotel.description.comment) === null || _a === void 0 ? void 0 : _a.photo),
                                    comment: data.comment.comment
                                }
                            },
                            destination: data.description.destination
                        }
                    },
                    rating: { connect: { id: data.ratingId } },
                    city: { connect: { id: Number(data.cityId) } },
                    condition: { set: conditions.map(condition => ({ id: condition.id })) },
                    travelTime: { set: travelTimes.map(travelTime => ({ id: travelTime.id })) },
                    facilities: { set: facilities.map(facility => ({ id: facility.id })) },
                    sport: { set: sports.map(sport => ({ id: sport.id })) }
                },
                include: {
                    city: { include: { country: true } },
                    facilities: true,
                    description: true,
                    sport: true,
                    condition: true,
                    travelTime: true,
                    rating: true
                }
            });
            if (photos) {
                const photosPath = photos.hotel.map(photo => photo.path);
                findHotel.images.forEach(image => {
                    fs_1.default.unlinkSync(image.path);
                });
                yield database_1.prisma.images.deleteMany({
                    where: { hotelId: id }
                });
                yield database_1.prisma.images.createMany({
                    data: photosPath.map(path => ({ path, hotelId: id }))
                });
            }
            return updatedHotel;
        });
    }
    delete(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield database_1.prisma.hotel.findUnique({
                where: { id },
                include: {
                    images: true,
                    description: { include: { comment: true } }
                }
            });
            if (!hotel) {
                throw new appError_erros_1.AppError(404, "Hotel not found");
            }
            hotel.images.forEach(image => {
                fs_1.default.unlinkSync(image.path);
            });
            fs_1.default.unlinkSync(hotel.description.comment.photo);
            const deletedHotel = yield database_1.prisma.hotel.delete({
                where: { id },
                include: { images: true }
            });
            return deletedHotel;
        });
    }
};
exports.HotelServices = HotelServices;
exports.HotelServices = HotelServices = __decorate([
    (0, tsyringe_1.injectable)()
], HotelServices);
