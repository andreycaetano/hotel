import { injectable } from "tsyringe";
import { prisma } from "../database";

@injectable()
export class FacilitiesServices {
    async create(data: any) {
        const create = await prisma.facilities.create({ data: { ...data } })
        return create
    }
    
    async delete (id: number) {
        await  prisma.facilities.delete({where: {id: id}})
    }

    async get () {
        const get = await prisma.facilities.findMany()
        return get
    }
}