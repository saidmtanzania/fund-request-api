/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crypto from 'crypto';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import { sendMail } from '../utils/Email';
import catchAsync from '../utils/catchAsync';

const signToken = (id: any, next: any) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return next(new AppError('JWT secret is not defined', 401));
  }
  const token = jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user: any, statusCode: any, res: any, next: any) => {
  const token = signToken(user._id, next);
  const expireIn: any = process.env.JWT_COOKIE_EXPIRES_IN;
  if (!expireIn) {
    return next(new AppError('ExpireIn secret is not defined', 401));
  }
  const expiresInMs = parseInt(expireIn, 10) * 60 * 1000;
  const cookieOption = {
    expires: new Date(Date.now() + expiresInMs),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);
  user.password = undefined;
  user.role = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    user,
  });
};

export const signup: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const newUser = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res, next);
});

export const login: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  // 1) checking if email and password exist
  if (!email || !password) {
    return next(new AppError('Please Provide a email and password', 400));
  }

  // 2) Checking if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid user email or password', 401));
  }

  // 3) If everything is ok send token to a client
  createSendToken(user, 200, res, next);
});

export const forgotPassword: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Please provide a valid email address ', 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordReset();
  await user.save({ validateBeforeSave: false });

  // Send to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot password? Submit a PATCH request with new password and passwordConfirm to: ${resetURL}.\n If you didn't forget password, ignore this email!`;
  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10m)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetExpires = undefined!;
    user.passwordResetToken = undefined!;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. try again later!', 500));
  }
});

export const resetPassword: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined!;
  user.passwordResetToken = undefined!;
  await user.save();

  createSendToken(user, 200, res, next);
});

export const updatePassword: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    throw new Error('User not found!');
  }

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, update JWT
  createSendToken(user, 200, res, next);
});

export const logout: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  res.status(200).json({
    message: 'User Successfully logout',
  });
});
