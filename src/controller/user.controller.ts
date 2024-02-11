import { inject, injectable } from "tsyringe";
import { UserServices } from "../services/user.services";
import { Request, Response } from "express";

@injectable()
export class UserController {
    constructor(@inject("UserServices") private UserServices: UserServices){}

    async create (req: Request, res: Response) {
        const create = await this.UserServices.create(req.body)
        return res.status(200).json(create)
    }

    async login (req: Request, res: Response) {
        const login = await this.UserServices.login(req.body, req, res)
        return res.status(200).json(login)
    }

    async update (req: Request, res: Response) {
        const update = await this.UserServices.update(Number(req.params.id), req.body)
        return res.status(200).json(update)
    }

    async delete (req: Request, res: Response) {
        await this.UserServices.delete(Number(req.params.id))
        return res.status(204).send()
    }

    async validateToken (req: Request, res: Response) {
        const verify = await this.UserServices.validateToken(req.body.token, req, res)
        return res.status(200).json({
            valid: true, role: verify
        })
    }
}