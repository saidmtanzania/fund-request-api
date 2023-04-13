/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Fund from '../models/fund.model';
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

export const requestExemption: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const requestedBy = req.user.id;
  const { reason } = req.body;

  const fundRequest = await Fund.findOneAndUpdate(
    { _id: id, requestedBy },
    { receiptRequired: false, status: 'Pending', $push: { exemptionRequests: { reason } } },
    { new: true }
  );
});
