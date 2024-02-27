import { injectable } from "tsyringe";
import { prisma } from "../database";
import { ICity, ICountry, ICountryAndCities, ICreateCity, ICreateCountry } from "../interface/address.interface";
import { AppError } from "../errors/appError.erros";

@injectable()
export class AddressServices {
    async createCountry(data: ICreateCountry): Promise<ICountry> {
        const create = await prisma.country.create({
            data: {
                name: data.name
            }
        })
        return create
    }

    async updateCountry(data: ICreateCountry, id: number): Promise<ICountryAndCities> {
        const updated = await prisma.country.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            },
            include: {
                cities: true
            }
        })
        return updated
    }

    async getCountry(): Promise<ICountryAndCities[]> {
        const get = await prisma.country.findMany({
            include: {
                cities: true
            }
        })
        return get
    }

    async deleteCountry(id: number): Promise<void> {
        const citiesWithHotels = await prisma.cities.findMany({
            where: {
                countryId: id,
                hotel: {
                    some: {}
                }
            }
        });
        if (citiesWithHotels.length === 0) throw new AppError(400, "This country cannot be deleted. There are cities linked to hotels.")

        await prisma.country.delete({ where: { id } })
    }

    async createCity(data: ICreateCity): Promise<ICity> {
        const create = await prisma.cities.create({
            data: {
                name: data.name,
                country: {
                    connect: { id: data.countryId }
                }
            }
        })
        return create
    }

    async updateCity(data: ICreateCity, id: number): Promise<ICity> {
        const findCity = await prisma.cities.findFirst({ where: { id: id } })
        if (!findCity) {
            throw new AppError(404, "City not found.")
        }
        const updated = await prisma.cities.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                countryId: {
                    set: data.countryId
                }
            },
        })
        return updated
    }

    async deleteCity(id: number): Promise<void> {
        const cityWithHotels = await prisma.cities.findUnique({
            where: {
                id: id
            },
            include: {
                hotel: true
            }
        });

        if (!cityWithHotels) throw new AppError(400, "This city cannot be deleted. It is linked to hotels.")
        await prisma.cities.delete({
            where: {
                id: id
            }
        });
    }

    async getCities(): Promise<ICity[]> {
        const cities = await prisma.cities.findMany({
            include: {
                country: true
            }
        })
        return cities
    }
}