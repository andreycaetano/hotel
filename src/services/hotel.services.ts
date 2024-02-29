import { injectable } from "tsyringe";
import { prisma } from "../database";
import fs from 'fs/promises';
import path from 'path';
import { UploadedFile } from "../config/multer.config";
import { Request } from "express";
import { AppError } from "../errors/appError.erros";
import { ICreateHotel } from "../interface/hotel.interface";

@injectable()
export class HotelServices {
    async create(req: Request) {
        const photos = req.files as UploadedFile[] | undefined;
        if (!photos) {
            throw new AppError(404, "Photos are required.")
        }
        const photosPath = photos.map(photo => photo.path)

        const data: ICreateHotel = req.body
        data.facilitiesIds = JSON.parse(data.facilitiesIds as string)
        data.sportsIds = JSON.parse(data.sportsIds as string)
        data.description = JSON.parse(data.description as string)
        const findCity = await prisma.cities.findUnique({
            where: {
                id: Number(data.cityId)
            }
        })
        if (!findCity) {
            throw new AppError(404, "City not found")
        }
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

        const created = await prisma.hotel.create({
            data: {
                name: data.name,
                description: {
                    create: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        comment: data.description.comment,
                        destination: data.description.destination
                    }
                },
                star: Number(data.star),
                images: {
                    set: photosPath
                },
                city: {
                    connect: { id: Number(data.cityId) }
                },
                facilities: {
                    connect: facilities.map(facility => ({ id: facility.id }))
                },
                condition: {
                    connect: { id: Number(data.conditionId) }
                },
                travelTime: {
                    connect: { id: Number(data.travelTimeId) }
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
                travelTime: true
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

            const formattedHotels = hotels.map(hotel => ({
                id: hotel.id,
                name: hotel.name,
                star: hotel.star,
                description: {
                    accommodation: hotel.description?.accommodation,
                    activities: hotel.description?.activities,
                    comment: hotel.description?.comment,
                    destination: hotel.description?.destination
                },
                address: {
                    country: hotel.city.country.name,
                    city: hotel.city.name
                },
                facilities: hotel.facilities,
                images: hotel.images,
                condition: hotel.condition,
                travelTime: hotel.travelTime,
                sport: hotel.sport
            }));

            return formattedHotels;
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
        const data = req.body;
        const photos = req.files as UploadedFile[] | undefined;
        data.facilitiesIds = JSON.parse(data.facilitiesIds as string)
        data.sportsIds = JSON.parse(data.sportsIds as string)
        data.description = JSON.parse(data.description as string)

        const existingHotel = await prisma.hotel.findUnique({
            where: { id },
            include: { description: true, sport: true, facilities: true }
        });
        if (!existingHotel) {
            throw new AppError(404, "Hotel not found");
        }

        const sport = await prisma.sports.findMany({
            where: {
                id: {
                    in: data.sportsIds
                }
            }
        })
        const existingSportsIds = existingHotel.sport.map(s => s.id);
        const newSportsIds = sport.map(s => s.id);
        const sportsToDisconnect = existingSportsIds.filter(id => !newSportsIds.includes(id));


        const facilities = await prisma.facilities.findMany({
            where: {
                id: {
                    in: data.facilitiesIds
                }
            }
        })
        const existingFacilitiesIds = existingHotel.facilities.map(f => f.id);
        const newFacilitiesIds = facilities.map(f => f.id);
        const facilitiesToDisconnect = existingFacilitiesIds.filter(id => !newFacilitiesIds.includes(id));


        if (!photos) {
            const updated = await prisma.hotel.update({
                where: { id },
                data: {
                    name: data.name,
                    description: {
                        update: {
                            accommodation: data.description.accommodation,
                            activities: data.description.activities,
                            comment: data.description.comment,
                            destination: data.description.destination
                        }
                    },
                    condition: {
                        connect: { id: Number(data.condition) }
                    },
                    travelTime: {
                        connect: { id: Number(data.travelTime) }
                    },
                    sport: {
                        connect: sport.map(sport => ({ id: sport.id })),
                        disconnect: sportsToDisconnect.map(id => ({ id }))
                    },
                    facilities: {
                        connect: facilities.map(facility => ({ id: facility.id })),
                        disconnect: facilitiesToDisconnect.map(id => ({ id }))
                    },
                    star: Number(data.star),
                    city: { connect: { id: Number(data.cityId) } }
                },
                include: {
                    city: { include: { country: true } },
                    facilities: true,
                    description: true,
                    sport: true,
                    condition: true,
                    travelTime: true
                }
            });
            const updateHotel = {
                id: updated.id,
                name: updated.name,
                star: updated.star,
                description: {
                    accommodation: updated.description.accommodation,
                    activities: updated.description.activities,
                    comment: updated.description.comment,
                    destination: updated.description.destination
                },
                address: {
                    country: updated.city.country.name,
                    city: updated.city.name
                },
                facilities: updated.facilities,
                images: updated.images,
                condition: updated.condition.condition,
                travelTime: updated.travelTime.travelTime,
                sport: updated.sport
            }

            return updateHotel;
        }

        const existingImagesPaths = existingHotel.images;
        const newImagesPaths: string[] = [];

        for (const imagePath of existingImagesPaths) {
            if (!photos.some(photo => photo.path === imagePath)) {
                newImagesPaths.push(imagePath);
            }
        }

        const imagesToDelete = existingImagesPaths.filter(image => !newImagesPaths.includes(image));
        console.log(existingHotel);
        console.log(newImagesPaths);


        for (const imagePath of imagesToDelete) {
            await fs.unlink(path.join('upload', imagePath));
        }

        const updated = await prisma.hotel.update({
            where: { id },
            data: {
                name: data.name,
                description: {
                    update: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        comment: data.description.comment,
                        destination: data.description.destination
                    }
                },
                condition: {
                    connect: { id: Number(data.conditionId) }
                },
                travelTime: {
                    connect: { id: Number(data.travelTimeId) }
                },
                sport: {
                    connect: sport.map(sport => ({ id: sport.id })),
                    disconnect: sportsToDisconnect.map(id => ({ id }))
                },
                facilities: {
                    connect: facilities.map(facility => ({ id: facility.id })),
                    disconnect: facilitiesToDisconnect.map(id => ({ id }))
                },
                star: Number(data.star),
                images: { set: [...newImagesPaths, ...photos.map(photo => photo.path)] },
                city: { connect: { id: Number(data.cityId) } }
            },
            include: {
                city: { include: { country: true } },
                facilities: true,
                description: true,
                sport: true,
                condition: true,
                travelTime: true
            }
        });

        const updateHotel = {
            id: updated.id,
            name: updated.name,
            star: updated.star,
            description: {
                accommodation: updated.description.accommodation,
                activities: updated.description.activities,
                comment: updated.description.comment,
                destination: updated.description.destination
            },
            address: {
                country: updated.city.country.name,
                city: updated.city.name
            },
            facilities: updated.facilities,
            images: updated.images,
            condition: updated.condition.condition,
            travelTime: updated.travelTime.travelTime,
            sport: updated.sport
        }

        return updateHotel;
    }

    async delete(req: Request, id: number): Promise<void> {
        const hotel = await prisma.hotel.findFirst({ where: { id: id } })
        if (!hotel) {
            throw new AppError(404, "Hotel not found.");
        }
        const paths = hotel?.images || [];
        for (const path of paths) {

            await fs.unlink(path);
        }
    }
}