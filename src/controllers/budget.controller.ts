/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Budget from '../models/budget.model';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

export const createBudget: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { month, items, carryOverAmount } = req.body;
  // Validate that month is provided
  if (!month) {
    return next(new AppError('Month is required', 400));
  }
  const date = new Date(month);

  const exist = await Budget.find();
  const existingBudget = exist.find(
    (budget) => budget.month.getMonth() === date.getMonth() && budget.month.getFullYear() === date.getFullYear()
  );

  if (existingBudget) {
    return next(new AppError('Budget for the given month already exists', 400));
  }

  const budget = await Budget.create({ month, items, carryOverAmount }, { new: true });

  // Return success response
  res.status(201).json({ success: true, budget });
});

export const getBudget: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const budget = await Budget.find();
  // Return success response
  res.status(200).json({ success: true, budget });
});

export const createBudgetItem: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { items } = req.body;
  const { id } = req.params;

  const budget = await Budget.findById(id);

  if (!budget) {
    return next(new AppError('Budget not found', 404));
  }

  if (
    new Date().getMonth() >= budget.month.getMonth() &&
    new Date().getFullYear() >= budget.month.getFullYear() &&
    new Date().getDate() > 10
  ) {
    return next(new AppError('Item creation failed! Wait for next month', 400));
  }
  // Check if items already exist in the budget
  const existingItems = budget.items.filter((item: any) =>
    items.some(
      (newItem: any) =>
        newItem.project === item.project._id.toString() && newItem.category === item.category._id.toString()
    )
  );

  if (existingItems.length > 0) {
    return next(new AppError('Items already exist in the budget', 400));
  }

  budget.items.push(...items);
  await budget.save();

  // Return success response
  res.json({ success: true, budget });
});

export const getBudgetItems: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;

  const budget = await Budget.findById(id);

  if (!budget) {
    return next(new AppError('Budget not found', 404));
  }

  // Return success response
  res.status(200).json({ success: true, items: budget.items });
});

export const getBudgetItem: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id, item } = req.params;

  const budget = await Budget.findById(id);

  // Change status code to 404 for not found
  if (!budget) {
    return next(new AppError('Budget not found', 404));
  }

  // Use find() method to search for item
  const data = budget.items.find((itemz: any) => itemz._id.toString() === item);

  // Change status code to 404 for not found
  if (!data) {
    return next(new AppError('Item not found', 404));
  }

  // Return success response
  res.status(200).json({ success: true, data });
});
