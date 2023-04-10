/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import Category from '../models/category.model';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';

export const getAllCategory: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Category.find(filter), req.query).filter().sort().limitFields().paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  if (doc.length === 0) {
    return next(new AppError('Unfortunate!, There is no Category at the moment, try again later', 404));
  }
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: doc,
  });
});

export const createCategory: RequestHandler = catchAsync(async (req: any, res: any, _next: any) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      Category: newCategory,
    },
  });
});

export const getCategory: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('There is no Category with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

export const updateCategory: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError('There is no Category exist with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

export const deleteCategory: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const catID = req.params.id;
  const category = await Category.findByIdAndDelete(catID);
  if (!category) {
    return next(new AppError('There is no Category exist with that ID!', 404));
  }

  res.status(204).json({
    status: 'success',
    message: `Category with this ID:${catID} has been deleted Successfully`,
  });
});
