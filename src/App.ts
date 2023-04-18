import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import budgetRoute from './routes/budget.routes';
import categoryRoute from './routes/category.routes';
import projectRoute from './routes/project.routes';
import requestRoute from './routes/request.routes';
import roleRoute from './routes/role.routes';
import userRoute from './routes/user.routes';
import AppError from './utils/AppError';
import eHandler from './utils/errorHandler';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '40kb' }));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/roles', roleRoute);
app.use('/api/v1/projects', projectRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/funds', requestRoute);
app.use('/api/v1/budget', budgetRoute);

// handling unknown routes
app.all('*', (req, _res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(eHandler);

export default app;
