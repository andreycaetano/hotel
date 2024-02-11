import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import './container/index';
import express, { json } from 'express';
import { hotelRouter } from './routes/hotel.routes';
import { HandleErrors } from './errors/handleErrors.errors';
import { userRoutes } from './routes/user.routes';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(json());
app.use(HandleErrors.execute);

app.use('/uploads', express.static('uploads'));

app.use('/', hotelRouter);
app.use('/user', userRoutes);