import { inject, injectable } from "tsyringe";
import { HotelServices } from "../services/hotel.services";
import { Request, Response } from "express";
import { IImage } from "../interface/hotel.interface";


@injectable()
export class HotelController {
    constructor(@inject("HotelServices") private HotelServices: HotelServices) {}

    async create (req: Request, res: Response) {
        const createdHotel = await this.HotelServices.create(req.body, req.files)
        return res.status(200).json(createdHotel)
    }

    async getAll (req: Request, res: Response) {
        const get = await this.HotelServices.getAll()
        return res.status(200).json(get)
    }

    async update (req: Request, res: Response) {
        const updated = await this.HotelServices.update(req.body, Number(req.params.id))
        return res.status(200).json(updated)
    }

    async delete (req:Request, res: Response) {
        await this.HotelServices.delete(Number(req.params.id))
        return res.status(200).send()
    }
}