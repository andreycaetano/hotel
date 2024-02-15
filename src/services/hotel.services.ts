import { injectable } from "tsyringe";
import { prisma } from "../database";
import fs from 'fs';
import { ICreatedHotel } from "../interface/hotel.interface";

@injectable()
export class HotelServices {
    async create(data: ICreatedHotel, photos: any) {
        const imagesPath = photos.map((element: any) => element.path);
        const countryId = data.address.countryId;
        const stateId = data.address.stateId;
    
        const createdHotel = await prisma.hotel.create({
            data: {
                name: data.name,
                images: imagesPath,
                star: Number(data.star),
                description: JSON.parse(data.description),
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
                        connect: JSON.parse(data.facilitesIds).map((id: any) => ({ id }))
                    }
                }                
            },
            include: {
                facilities: true,
            }
        });
        return createdHotel;
    }

    async get(id?: number) {
        if (id) {
            const get = await prisma.hotel.findFirst({
                where: { id: id },
                include: {
                    facilities: true
                }
            })
            return get
        }
        const get = await prisma.hotel.findMany({
            include: {
                facilities: true
            }
        })
        return get
    }

    async update(data: any, id: number) {
        const updatedHotel = await prisma.hotel.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                images: data.images,
                star: data.star,
                facilities: {
                    set: [],
                    connect: data.facilitesIds.map((id: any) => id.id)
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
        path?.forEach((element: any) => {
            deleteFile(element)
        })
        await prisma.hotel.delete({ where: { id: id } })
    }
}