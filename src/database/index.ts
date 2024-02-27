import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export const main = async () => {
    const existingCondition = await prisma.conditions.findMany();
    if (existingCondition.length === 0) {
        await prisma.conditions.createMany({
            data: [
                { condition: "All inclusive" },
                { condition: "Half board" },
                { condition: "Full board" },
                { condition: "Bed and breakfast" }
            ]
        })
    }

    const existingTravelTime = await prisma.travelTime.findMany()
    if (existingTravelTime.length === 0) {
        await prisma.travelTime.createMany({
            data: [
                { travelTime: "3 day" },
                { travelTime: "4 day" },
                { travelTime: "More than 5 day" }
            ]
        })
    }

    const existingSports = await prisma.sports.findMany()
    if (existingSports.length === 0) {
        await prisma.sports.createMany({
            data: [
                { name: "Football" },
                { name: "Hockey" },
                { name: "Athletics" },
                { name: "Padel" }
            ]
        })
    }
}