/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

const filterObj = (obj: Record<string, any>, ...allowedFields: any[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export const getAllUser: RequestHandler = catchAsync(async (_req: any, res: any, next: any) => {
  const users = await User.find().select('-_id -__v');

  if (users.length === 0) {
    return next(new AppError('There is no user at the moment', 404));
  }
  res.status(200).json({
    message: 'User Successfully fetched',
    data: users,
  });
});

export const updateMe: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for update password. Please use /updateMyPassword', 400));
  }
  const filteredBody = filterObj(req.body, 'first_name', 'last_name', 'email', 'phone');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      users: updatedUser,
    },
  });
});

export const createUser: RequestHandler = catchAsync(async (req: any, res: any, _next: any) => {
  const userData = req.body;
  const user = await User.create(userData);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

export const getUser: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('There is no user with that ID!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const updateUser: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  if (req.body.role) {
    const uId = req.params.id;
    let user = await User.findById(uId);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    const filteredBody = filterObj(req.body, 'first_name', 'last_name', 'email', 'phone');
    user = await User.findByIdAndUpdate(uId, filteredBody);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } else {
    return next(new AppError('This route is for update role only!', 400));
  }
});

export const deleteUser: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const delId = req.params.id;
  const user = await User.findByIdAndDelete(delId);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: `User with this ID:${delId} has been deleted Successfully`,
  });
});
