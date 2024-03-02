import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import './container/index';
import express, { json } from 'express';
import { hotelRouter } from './routes/hotel.routes';
import { HandleErrors } from './errors/handleErrors.errors';
import { userRoutes } from './routes/user.routes';
import cors from 'cors';
import { facilitiesRoutes } from './routes/facilities.routes';
import { addressRoutes } from './routes/address.routes';
import { conditionsRoutes } from './routes/conditions.routes';
import { sportRoutes } from './routes/sports.routes';
import { travelTimeRoutes } from './routes/travelTime.routes';
import { ratingRoutes } from './routes/rating.routes';

export const app = express();
app.use(cors());
app.use(json());

app.use('/uploads', express.static('uploads'));

app.use('/hotels', hotelRouter);
app.use('/user', userRoutes);
app.use("/facilities", facilitiesRoutes);
app.use("/address", addressRoutes);
app.use("/conditions", conditionsRoutes);
app.use("/sports", sportRoutes);
app.use("/travelTime", travelTimeRoutes);
app.use("/rating", ratingRoutes)

app.use(HandleErrors.execute);