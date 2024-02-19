import { injectable } from "tsyringe";
import { prisma } from "../database";
import fs from 'fs';
import { HotelData, ICreateHotel, ICreatedHotel, NullableHotel } from "../interface/hotel.interface";
import { UploadedFile } from "../config/multer.config";
import { Request } from "express";
import { AppError } from "../errors/appError.erros";

@injectable()
export class HotelServices {
    async create(req: Request): Promise<ICreatedHotel> {
        const data: ICreateHotel = req.body
        const photos = req.file as UploadedFile[] | undefined;
        if(!photos){
            throw new AppError(404, "Photos is require.")
        }
        const imagesPath = photos.map((element) => element.path);
        const countryId = data.address.countryId;
        const stateId = data.address.stateId;
    
        const createdHotel = await prisma.hotel.create({
            data: {
                name: data.name,
                images: imagesPath,
                star: Number(data.star),
                description: {
                    create: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        comment: data.description.comment,
                        destination: data.description.destination
                    }
                },
                address: {
                    country: {
                        connect: { id: countryId },
                        include: {
                            country: true
                        }
                    },
                    state: {
                        connect: { id: stateId },
                        include: {
                            state: true
                        }
                    },
                    facilities: {
                        connect: data.facilitesIds.map((id) => ({ id }))
                    }
                }                
            },
            include: {
                facilities: true,
                description: true
            }
        });
        return createdHotel;
    }

    async get(id?: number): Promise<NullableHotel | NullableHotel[]> {
        if (id) {
            const get = await prisma.hotel.findFirst({
                where: { id: id },
                include: {
                    facilities: true
                }
            })
            if(!get){
                throw new AppError(404, "Hotel not found.")
            }
            return get
        }
        const get = await prisma.hotel.findMany({
            include: {
                facilities: true
            }
        })
        return get
    }

    async update(req: Request, id: number): Promise<HotelData> {
        const deleteFile = (filePath: string) => {
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log('Erro ao deletar arquivo.');
                }
            });
        };
        const find = await prisma.hotel.findFirst({where: {id: id}})
        if(!find){
            throw new AppError(404, "Hotel not found")
        }

        const data: ICreateHotel = req.body
        const photos = req.file as UploadedFile[] | undefined;
        if(!photos){
            throw new AppError(404, "Photos is require.")
        }
        find.images.forEach(path => deleteFile(path))
        const imagesPath = photos.map((element) => element.path);
        const updatedHotel = await prisma.hotel.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                address: data.address,
                description: { 
                    update: {
                        accommodation: data.description.accommodation,
                        activities: data.description.activities,
                        comment: data.description.comment,
                        destination: data.description.destination
                    }
                },
                images: {
                    set: imagesPath,
                },
                star: data.star,
                facilities: {
                    set: [],
                    connect: data.facilitesIds.map((id) => ({ id }))
                }
            }
        });
        return updatedHotel;
    }

    async delete(id: number): Promise<void> {
        const hotel = await prisma.hotel.findFirst({ where: { id: id } })
        const path = hotel?.images
        const deleteFile = (filePath: string) => {
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log('Erro ao deletar arquivo.');
                }
            });
        };
        path?.forEach((element) => {
            deleteFile(element)
        })
        await prisma.hotel.delete({ where: { id: id } })
    }
}