import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import projectRoute from './routes/projectRoutes';
import userRoute from './routes/userRoutes';
import AppError from './utils/AppError';
import eHandler from './utils/errorHandler';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '40kb' }));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/projects', projectRoute);

// handling unknown routes
app.all('*', (req, _res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(eHandler);

export default app;
