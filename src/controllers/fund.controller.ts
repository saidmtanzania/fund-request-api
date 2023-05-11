/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Budget from '../models/budget.model';
import Fund from '../models/fund.model';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';

const ItemDeal = (budget: any, projName: any, categName: any) => {
  const budgetItem = budget.items.find((item: any) => item.project.equals(projName) && item.category.equals(categName));
  return budgetItem;
};

const budDeal = async (next: any) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const budget = await Budget.findOne({
    $expr: {
      $and: [{ $eq: [{ $year: '$month' }, year] }, { $eq: [{ $month: '$month' }, month] }],
    },
  });
  if (!budget) {
    return next(new AppError(`Budget not found for month: ${month} and year: ${year}`, 404));
  }
  return budget;
};

// Get All Request
export const getAllRequest: RequestHandler = catchAsync(async (req: any, res: any, _next: any) => {
  const feature = new APIFeatures(Fund.find(), req.query).filter().sort().limitFields().paginate();
  // Execute query
  const request = await feature.query;
  res.status(200).json({
    message: 'all request captured',
    data: request,
  });
});

export const getRequest: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const reqRes = await Fund.findOne({ _id: id, requestedBy: req.user._id });
  if (!reqRes) {
    return next(new AppError('No request found', 404));
  }
  res.status(200).json({
    message: 'request captured',
    data: reqRes,
  });
});

export const sendRequest: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { projectName, categoryName, fundAmount, fundReason } = req.body;
  const receiptRequired = req.body.receiptRequired || false;

  const budget = await budDeal(next);
  // console.log(budget);

  // const budgetItem = budget.items.find(
  //   (item) => item.project.equals(projectName) && item.category.equals(categoryName)
  // );
  const budgetItem = ItemDeal(budget, projectName, categoryName);
  // console.log(budgetItem.amount);
  // const budgetItem = await findBudgetByMonthAndYear(5, 2023, projectName, categoryName, next);
  if (!budgetItem) {
    return next(new AppError('Budget not found', 404));
  }

  if (fundAmount > budgetItem.amount) {
    return next(new AppError('Requested amount is too large', 400));
  }

  const pending = await Fund.findOne({ status: 'Pending', projectName, categoryName, requestedBy: req.user._id });

  if (pending) {
    return next(new AppError('Cant create identical request at the same time!', 400));
  }
  const request = await Fund.create({
    projectName,
    categoryName,
    fundAmount,
    fundReason,
    receiptRequired,
    requestedBy: req.user._id,
  });

  res.status(201).json({
    message: 'all them request Successfully Created.',
    data: request,
  });
});

export const updateRequest: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const fund = await Fund.findOne({ _id: id, requestedBy: req.user._id });
  if (!fund) {
    return next(new AppError('request not found', 404));
  }
  if (fund.status === 'Approved' || fund.status === 'Rejected') {
    return next(new AppError('Cant update Approved or Rejected Request', 400));
  }

  const fundres = await Fund.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  res.status(200).json({ message: 'Request has been updated', data: fundres });
});

export const approveRequest: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const { status, rejectedReason, receiptRequired } = req.body;
  const approvedBy = req.user._id;
  const fund = await Fund.findOne({ _id: id });
  if (!fund) {
    return next(new AppError('request not found', 404));
  }
  if (fund.status === 'Approved' || fund.status === 'Rejected') {
    return next(new AppError('Cant update Approved or Rejected Request', 400));
  }
  if (status || rejectedReason || receiptRequired) {
    const fundres = await Fund.findByIdAndUpdate(
      { _id: id },
      { status, rejectedReason, receiptRequired, approvedBy },
      { new: true }
    );
    if (!fundres) {
      return next(new AppError('Bad EmP', 400));
    }
    if (fundres.status === 'Approved') {
      const budget = await budDeal(next);
      const items = ItemDeal(budget, fundres.projectName._id, fundres.categoryName._id);
      items.monthlyAmountsUsed.push({
        month: new Date(),
        amountUsed: fundres.fundAmount,
      });
      items.amount -= fundres.fundAmount;
      await budget.save();
    }
    res.status(200).json({ message: 'Request has been updated', data: fundres });
  } else {
    return next(new AppError('This route for approving or rejecting request', 400));
  }
});

export const requestExemption: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const requestedBy = req.user.id;
  const { reason } = req.body;
  if (req.body.reason) {
    const exemptRes = await Fund.findOneAndUpdate(
      { _id: id, requestedBy },
      { receiptRequired: false, status: 'Pending', exemptionRequests: reason },
      { new: true }
    );

    res.status(200).json({ message: 'exemption sent Successfully', data: exemptRes });
  } else {
    return next(new AppError('This route for applying exemption only', 400));
  }
});

export const getFundStats: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const stats = Fund.aggregate();
});
