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
    return res.status(400).json({ success: false, message: 'Month is required' });
  }

  const validMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (!validMonths.includes(month)) {
    return res.status(400).json({ success: false, message: 'Invalid month' });
  }

  const budget = await Budget.create({ month, items, carryOverAmount });

  // Return success response
  res.json({ success: true, budget });
});

export const getBudget: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const budget = await Budget.find();

  // Return success response
  res.json({ success: true, budget });
});

export const createBudgetItem: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { items } = req.body;
  const { id } = req.params;

  const budget = await Budget.findById(id);
  // console.log(budget);

  if (!budget) {
    return res.status(400).json({ success: false, message: 'Budget not found' });
  }
  console.log(budget.items);
  budget.items.push(items);

  await budget.save();

  // Return success response
  res.json({ success: true, budget });
});

export const getBudgetItem: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id, item } = req.params;

  const budget = await Budget.findById(id);

  if (!budget) {
    return next(new AppError('Budget not found', 400));
  }
  let data: any;
  budget.items.forEach((itemz: any) => {
    if (itemz._id == item) data = itemz;
  });
  // Return success response
  res.status(200).json({ success: true, data });
});
