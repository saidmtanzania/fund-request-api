/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Fund from '../models/fund.model';
import User from '../models/user.model';
import appError from '../utils/AppError';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';

export const getRequest: RequestHandler = catchAsync(async (req: any, res: any, _next: any) => {
  const feature = new APIFeatures(Fund.find(), req.query).filter().sort().limitFields().paginate();
  // Execute query
  const request = await feature.query;
  res.status(200).json({
    message: 'all request captured',
    data: request,
  });
});

export const sendRequest: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const request = req.body;
  res.status(201).json({
    message: 'all them request Successfully Created.',
    data: request,
  });
});
