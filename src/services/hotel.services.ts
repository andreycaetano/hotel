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
        data.facilities = JSON.parse(data.facilities as string)
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
                    in: data.facilities
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
                }
            },
            include: {
                city: { include: { country: true } },
                facilities: true,
                description: true
            }
        })
        const createdHotel = {
            id: created.id,
            name: created.name,
            star: created.star,
            description: {
                accommodation: created.description.accommodation,
                activities: created.description.activities,
                comment: created.description.comment,
                destination: created.description.destination
            },
            address: {
                country: created.city.country.name,
                city: created.city.name
            },
            facilities: created.facilities,
            images: created.images
        }
        return createdHotel;
    }

    async get(id?: number) {
        let hotels;

        if (id) {
            const hotel = await prisma.hotel.findFirst({
                where: { id: id },
                include: {
                    facilities: true,
                    description: true,
                    city: { include: { country: true } }
                }
            });

            if (!hotel) {
                throw new AppError(404, "Hotel not found.");
            }

            hotels = [hotel];
        } else {
            hotels = await prisma.hotel.findMany({
                include: {
                    facilities: true,
                    description: true,
                    city: { include: { country: true } }
                }
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
            images: hotel.images
        }));

        return formattedHotels;
    }

    async update(id: number, req: Request) {
        const data = req.body;
        const photos = req.files as UploadedFile[] | undefined;

        const existingHotel = await prisma.hotel.findUnique({
            where: { id },
        });
        if (!existingHotel) {
            throw new AppError(404, "Hotel not found");
        }

        if (!photos) {
            const updatedHotel = await prisma.hotel.update({
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
                    star: Number(data.star),
                    city: { connect: { id: data.cityId } }
                }
            });

            return updatedHotel;
        }

        const existingImagesPaths = existingHotel.images;
        const newImagesPaths: string[] = [];

        for (const imagePath of existingImagesPaths) {
            if (!photos.some(photo => photo.path === imagePath)) {
                newImagesPaths.push(imagePath);
            }
        }

        const imagesToDelete = existingImagesPaths.filter(image => !newImagesPaths.includes(image));

        for (const imagePath of imagesToDelete) {
            await fs.unlink(path.join('upload', imagePath));
        }

        const updatedHotel = await prisma.hotel.update({
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
                star: Number(data.star),
                images: { set: [...newImagesPaths, ...photos.map(photo => photo.path)] },
                city: { connect: { id: data.cityId } }
            }
        });

        return updatedHotel;
    }

    async delete(req: Request, id: number): Promise<void> {
        const hotel = await prisma.hotel.findFirst({ where: { id: id } })
        if (!hotel) {
            throw new AppError(404, "Hotel not found.")
        }
        const path = hotel?.images
        path?.forEach(async (element) => {
            await fs.unlink(path.join(element));
        })
        await prisma.hotel.delete({ where: { id: id } })
    }
}