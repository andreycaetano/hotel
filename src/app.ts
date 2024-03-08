import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import './container/index';
import express from 'express';
import { json } from 'express';
import cors from 'cors';
import { hotelRouter } from './routes/hotel.routes';
import { userRoutes } from './routes/user.routes';
import { facilitiesRoutes } from './routes/facilities.routes';
import { addressRoutes } from './routes/address.routes';
import { conditionsRoutes } from './routes/conditions.routes';
import { sportRoutes } from './routes/sports.routes';
import { travelTimeRoutes } from './routes/travelTime.routes';
import { ratingRoutes } from './routes/rating.routes';
import { galeryRoutes } from './routes/galery.routes';
import { HandleErrors } from './errors/handleErrors.errors';
import { teamRouter } from './routes/team.routes';
import { newsRouter } from './routes/news.routes';

export const app = express();

app.use(cors());
app.use(json());
app.use('/uploads', express.static('uploads/'));
app.use('/uploads/authors/', express.static('uploads/authors/'))
app.use('/uploads/bannerNews/', express.static('uploads/bannerNews/'))
app.use('/uploads/galery/', express.static('uploads/galery/'))
app.use('/uploads/hotel/', express.static('uploads/hotel/'))
app.use('/uploads/icons/', express.static('uploads/icons/'))
app.use('/uploads/team/', express.static('uploads/team/'))

app.use('/hotels', hotelRouter);
app.use('/user', userRoutes);
app.use('/facilities', facilitiesRoutes);
app.use('/address', addressRoutes);
app.use('/conditions', conditionsRoutes);
app.use('/sports', sportRoutes);
app.use('/travelTime', travelTimeRoutes);
app.use('/rating', ratingRoutes);
app.use('/galery', galeryRoutes);
app.use('/team', teamRouter);
app.use("/news", newsRouter);

app.use(HandleErrors.execute);