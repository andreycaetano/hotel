import { injectable } from "tsyringe";
import { prisma } from "../database";

@injectable()
export class AddressServices {
    async createCountry(data: any) {
        const create = await prisma.country.create({
            data: {
                name: data.name
            }
        })
        return create
    }

    async updateCountry(data: any, id: number) {
        const updated = await prisma.country.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            },
            include: {
                states: true
            }
        })
        return updated
    }

    async getCountry() {
        const get = await prisma.country.findMany({
            include: {
                states: true
            }
        })
        return get
    }

    async deleteCountry(id: number) {
        await prisma.state.deleteMany({
            where: {
                countryId: id
            }
        })
        await prisma.country.delete({
            where: {
                id: id
            }
        })
    }

    async createState(data: any) {
        const create = await prisma.state.create({
            data: {
                name: data.name,
                country: {
                    connect: { id: data.countryId }
                }
            },
            include: {
                country: true
            }
        })
        return create
    }

    async updateState(data: any, id: number) {
        const updated = await prisma.state.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            },
            include: {
                country: true
            }
        })
    }

    async deleteState(id: number) {
        await prisma.state.delete({
            where: {id: id}
        })
    }
}