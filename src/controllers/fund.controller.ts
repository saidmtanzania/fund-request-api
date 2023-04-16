/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Fund from '../models/fund.model';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';

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

  const pending = await Fund.findOne({ status: 'Pending', projectName, categoryName, requestedBy: req.user._id });
  if (!pending) {
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
  } else {
    res.status(400).json({
      message: 'Cant create identical request at the same time!',
    });
  }
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
  }
  else{
    return next(new AppError('This route for applying exemption only', 400));
  }
});
