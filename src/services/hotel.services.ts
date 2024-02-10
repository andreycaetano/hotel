import { injectable } from "tsyringe";
import { prisma } from "../database";
import fs from 'fs';
import { IHotel } from "../interface/hotel.interface";


@injectable()
export class HotelServices {
    async create(data: any, photos: any): Promise<IHotel> {
        const imagesPath = photos.map((element: any) => element.path);
        const createdHotel = await prisma.hotel.create({
            data: {
                ...data,
                images: imagesPath
            }
        })
        return createdHotel
    }

    async getAll(): Promise<IHotel[]> {
        const get = await prisma.hotel.findMany()
        return get
    }

    async update(data: any, id: number): Promise<IHotel> {
        const updetedHotel = await prisma.hotel.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        })
        return updetedHotel
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