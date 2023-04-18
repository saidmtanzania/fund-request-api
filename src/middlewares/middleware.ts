/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

export const protect: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  let token;

  // 1) Getting token and validate if is available
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in! Please login to get access', 401));
  }

  // 2) Token verification
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    return next(new AppError('JWT secret is not defined', 401));
  }

  const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

  // 3) Checking if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist', 401));
  }

  // 4) Checking if user changing password after token issued
  if (await currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login again.', 401));
  }

  // Granted access to protected routes
  req.user = currentUser;
  next();
});

// Middleware to check if current date is past 1st of the month
export const checkBudgetCreationDate: RequestHandler = (req: any, res: any, next: any) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstOfMonth = new Date(currentYear, currentMonth, 1);

  // Check if current date is past 1st of the month
  if (currentDate > firstOfMonth) {
    return next(new AppError('Budget creation is only allowed before the 1st of the month', 403));
  }

  // Continue to next middleware or route handler
  next();
};

export const hasPermission =
  (...Permissions: any[]) =>
  (req: any, _res: any, next: any) => {
    const { ...resource } = req.user.role.privileges;
    const { ...resources } = Permissions;

    const isMatching = Object.values(resource).some(
      (data: any) =>
        Object.keys(resources[0].resources).every((key) => resources[0].resources[key] && data.resource[key]) &&
        data.actions.every((action: any) => resources[0].actions.includes(action))
    );

    if (isMatching === false) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };

export const restrictTo =
  (...roles: any[]) =>
  (req: any, _res: any, next: any) => {
    if (!roles.includes(req.user.role.name)) {
      return next(new AppError('Action forbidden!', 403));
    }
    next();
  };
