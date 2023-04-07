/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Schema, model, Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  photo?: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  changePasswordAfter: (any: any) => Promise<boolean>;
  createPasswordReset: () => any;
}

const userSchema = new Schema<IUser>({
  first_name: {
    type: String,
    required: [true, 'Please tell us your first name!'],
  },
  last_name: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    minlength: [10, 'Please provide a valid phone number'],
    max: [13, 'Please provide a valid phone number'],
    validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator(this: any, el: string) {
        return el === this.password;
      },
      message: 'Password does not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (this: any, next) {
  // for modified password only
  if (!this.isModified('password')) return next();
  // generating password round
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  // hash password
  this.password = await bcrypt.hash(this.password, salt);
  // delete password confirm field
  this.passwordConfirm = undefined;
  return next();
});

userSchema.pre('save', function (this: any, next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

userSchema.methods.correctPassword = async function (candidatePassword: any, userPassword: any) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = (this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model<IUser>('User', userSchema);

export default User;
