import { NextFunction, Request, Response } from 'express';
import { AppError } from './appError.erros';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';

export class HandleErrors {
  static execute(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof ZodError) {
      return res.status(409).json(err);
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ err });
    } else {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
