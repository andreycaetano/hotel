import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import './container/index';
import express, { json, Response } from 'express';
import { hotelRouter } from './routes/hotel.routes';
import { HandleErrors } from './errors/handleErrors.errors';
import { userRoutes } from './routes/user.routes';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { prisma } from './database';

export const app = express();
app.use(cors());
app.use(json());
app.use(HandleErrors.execute);

const verificarToken = (token: string): any | null => {
  try {
    const decodedToken = jwt.verify(token, 'ek1ltest');
    return decodedToken;
  } catch (error) {
    console.error('Erro ao verificar ou decodificar o token:', error);
    return null;
  }
};

app.post('/verifytoken', async (req: any, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ valid: false, message: 'Token não fornecido' });
  }

  const decodedToken = verificarToken(token);

  if (!decodedToken) {
    return res.status(401).json({ valid: false, message: 'Token inválido' });
  }

  const findUser = await prisma.users.findFirst({
    where: {
      id: decodedToken.id,
    },
  });
  console.log(findUser);
  res.status(200).json({ valid: true, role: findUser });
});

app.use('/uploads', express.static('uploads'));
app.use('/', hotelRouter);
app.use('/user', userRoutes);
