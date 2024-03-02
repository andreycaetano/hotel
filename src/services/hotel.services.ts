// @ts-nocheck
import { injectable } from "tsyringe";
import { prisma } from "../database";
import fs from 'fs';
import { UploadedFiles } from "../config/multer.config";
import { Request } from "express";
import { AppError } from "../errors/appError.erros";
import { ICreateHotel } from "../interface/hotel.interface";

@injectable()
export class HotelServices {
    async create(req: Request) {
        const photos = req.files as UploadedFiles;
        if (!photos) {
            throw new AppError(404, "Photos are required.")
        }
        const photosPath = photos.hotel.map(photo => photo.path)
        const data: ICreateHotel = req.body
        data.facilitiesIds = JSON.parse(data.facilitiesIds as string)
        data.conditionIds = JSON.parse(data.conditionIds as string)
        data.travelTimeIds = JSON.parse(data.travelTimeIds as string)
        data.sportsIds = JSON.parse(data.sportsIds as string)
        data.description = JSON.parse(data.description as string)
        data.description.comment = JSON.parse(data.description.comment as string)
        const findCity = await prisma.cities.findUnique({
            where: {
                id: Number(data.cityId)
            }
        })
        if (!findCity) {
            throw new AppError(404, "City not found")
        }
        const conditions = await prisma.conditions.findMany({
            where: {
                id: {
                    in: data.conditionIds
                }
            }
        })
        const travelTimes = await prisma.travelTime.findMany({
            where: {
                id: {
                    in: data.travelTimeIds
                }
            }
        })
        const facilities = await prisma.facilities.findMany({
            where: {
                id: {
                    in: data.facilitiesIds
                }
            }
        })
        const sport = await prisma.sports.findMany({
            where: {
                id: {
                    in: data.sportsIds
                }
            }
        })

        const commentCreate = await prisma.comment.create({
            data: {
                author: "asd",
                photo: "asd",
                comment: "asd"
            }
        })

        const created = await prisma.hotel.create({
            data: {
                name: data.name,
                description: {
                    create: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        commentId: commentCreate.id,
                        destination: data.description.destination
                    }
                },
                rating: {
                    connect: {id: data.ratingId}
                },
                images: {
                    createMany: {
                        data: photosPath.map(path => ({ path }))
                    }
                },
                city: {
                    connect: { id: Number(data.cityId) }
                },
                facilities: {
                    connect: facilities.map(facility => ({ id: facility.id }))
                },
                condition: {
                    connect: conditions.map(condition => ({ id: condition.id }))
                },
                travelTime: {
                    connect: travelTimes.map(travelTime => ({ id: travelTime.id }))
                },
                sport: {
                    connect: sport.map(sport => ({ id: sport.id }))
                },
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
        })

        return created;
    }

    async get(id?: number, filters?: any) {
        let hotels;

        try {
            if (id) {
                const hotel = await prisma.hotel.findFirst({
                    where: { id: id },
                    include: this.includeRelations()
                });

                if (!hotel) {
                    throw new AppError(404, "Hotel not found.");
                }

                hotels = [hotel];
            } else {
                const whereClause = this.buildWhereClause(filters);
                hotels = await prisma.hotel.findMany({
                    where: whereClause,

                    include: this.includeRelations()
                });
            }

            return hotels;
        } catch (error) {
            throw new AppError(500, "Internal Server Error");
        }
    }

    includeRelations() {
        return {
            facilities: true,
            description: true,
            city: { include: { country: true } },
            sport: true,
            condition: true,
            travelTime: true
        };
    }

    buildWhereClause(filters: any) {
        const where: any = {};

        if (filters) {
            if (filters.name) {
                where['name'] = { contains: filters.name.toLowerCase(), mode: "insensitive" };
            }
            if (filters.star) {
                where['star'] = parseInt(filters.star);
            }
            if (filters.city) {
                where['cityId'] = parseInt(filters.city);
            }
            if (filters.condition) {
                where['conditionId'] = parseInt(filters.condition);
            }
            if (filters.travelTime) {
                where['travelTimeId'] = parseInt(filters.travelTime);
            }
            if (filters.sport) {
                where['sports'] = { some: { id: parseInt(filters.sport) } };
            }
            if (filters.country) {
                where['city'] = { countryId: parseInt(filters.country) };
            }
        }

        return where;
    }

    async update(id: number, req: Request) {
        const photos = req.files as UploadedFiles | undefined;
        const data: ICreateHotel = req.body
        data.facilitiesIds = JSON.parse(data.facilitiesIds as string)
        data.sportsIds = JSON.parse(data.sportsIds as string)
        data.description = JSON.parse(data.description as string)
        data.conditionIds = JSON.parse(data.conditionIds as string)
        data.travelTimeIds = JSON.parse(data.travelTimeIds as string)

        const findHotel = await prisma.hotel.findUnique({
            where: { id },
            include: {
                images: true,
                description: {include: {comment: true}},
                
            }
        });

        if (!findHotel) {
            throw new AppError(404, "Hotel not found");
        }

        const findCity = await prisma.cities.findUnique({
            where: { id: Number(data.cityId) }
        });

        if (!findCity) {
            throw new AppError(404, "City not found");
        }

        const conditions = await prisma.conditions.findMany({
            where: {
                id: {
                    in: data.conditionIds
                }
            }
        })
        const travelTimes = await prisma.travelTime.findMany({
            where: {
                id: {
                    in: data.travelTimeIds
                }
            }
        })

        const facilities = await prisma.facilities.findMany({
            where: { id: { in: data.facilitiesIds } }
        });

        const sports = await prisma.sports.findMany({
            where: { id: { in: data.sportsIds } }
        });

        const updatedHotel = await prisma.hotel.update({
            where: { id },
            data: {
                name: data.name,
                description: {
                    update: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        comment: {
                            update: {
                                    author: data.description.comment.author,
                                    photo: photos?.author[0].path || findHotel.description.comment?.photo!,
                                    comment: data.description.comment.comment
                            }
                        },
                        destination: data.description.destination
                    }
                },
                rating: { connect: { id: data.ratingId}},
                city: { connect: { id: Number(data.cityId) } },
                condition: { set: conditions.map(condition => ({ id: condition.id })) },
                travelTime: { set: travelTimes.map(travelTime => ({ id: travelTime.id })) },
                facilities: { set: facilities.map(facility => ({ id: facility.id })) },
                sport: { set: sports.map(sport => ({ id: sport.id })) }
            }
        });

        if (photos) {
            const photosPath = photos.hotel.map(photo => photo.path);
            findHotel.images.forEach(image => {
                fs.unlinkSync(image.path);
            });
            await prisma.images.deleteMany({
                where: { hotelId: id }
            });
            await prisma.images.createMany({
                data: photosPath.map(path => ({ path, hotelId: id }))
            });
        }

        return updatedHotel;

    }

    async delete(req: Request, id: number) {
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            include: {
                images: true
            }
        });

        if (!hotel) {
            throw new AppError(404, "Hotel not found");
        }

        const deletedHotel = await prisma.hotel.delete({
            where: { id },
            include: { images: true }
        });

        hotel.images.forEach(image => {
            fs.unlinkSync(image.path);
        });

        await prisma.images.deleteMany({
            where: { hotelId: id }
        });

        return deletedHotel;
    }
}