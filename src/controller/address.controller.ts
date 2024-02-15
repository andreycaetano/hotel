import { inject, injectable } from "tsyringe";
import { AddressServices } from "../services/address.services";
import { Request, Response } from "express";

@injectable()
export class AddressController {
    constructor(@inject("AddressServices") private AddressServices: AddressServices) {}

    async createCountry(req: Request, res: Response) {
        const create = this.AddressServices.createCountry(req.body)
    }
}