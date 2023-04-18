/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Budget from '../models/budget.model';
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
