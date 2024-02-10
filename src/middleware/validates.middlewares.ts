import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";
import { AnyZodObject } from "zod";
import { AppError } from "../errors/appError.erros";

interface IRequestSchemas {
   params?: AnyZodObject;
   body?: AnyZodObject;
   query?: AnyZodObject;
}

@injectable()
export class Validates {
   validateBody(schemas: IRequestSchemas) {
      return async (req: Request, res: Response, next: NextFunction) => {
         if (schemas.params) {
            req.params = await schemas.params.parseAsync(req.params);
         }

         if (schemas.body) {
            req.body = await schemas.body.parseAsync(req.body);
         }

         if (schemas.query) {
            req.query = await schemas.query.parseAsync(req.query);
         }
         next();
      };
   }

   async validateToken(req: Request, res: Response, next: NextFunction) {
      const token = req.headers.authorization
      if (!token) {
         throw new AppError(401, "Authorization token is required")
      }
      const verify = jwt.verify(token, process.env.SECRET_KEY_TOKEN!, async (err) => {
         throw new AppError(401, "Invalid token.")
      })
      next()
   }
}