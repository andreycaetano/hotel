import { Request } from "express";
import { injectable } from "tsyringe";
import { prisma } from "../database";
import { AppError } from "../errors/appError.erros";
import { UploadedFiles } from "../config/multer.config";
import fs from "fs"

@injectable()
export class GaleryServices {
    async create(images: UploadedFiles) {
        if (!images) throw new AppError(404, "Images is require")

        const create = await prisma.galery.createMany({
            data: images.galery.map(photo => ({ path: photo.path }))
        })
        return create
    }

    async delete(id: number) {
        const find = await prisma.galery.findFirst({ where: { id: id } })
        if (!find) throw new AppError(404, "Photo not found")

        fs.unlinkSync(find.path)
        await prisma.galery.delete({where: {id:id}})
    }
}