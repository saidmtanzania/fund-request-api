/* eslint-disable func-names */
import { Document, Schema, model, Types } from 'mongoose';

export interface IFundRequest extends Document {
  projectName: Types.ObjectId;
  categoryName: Types.ObjectId;
  fundAmount: number;
  fundReason: string;
  receiptRequired: boolean;
  receiptURL?: string;
  exemptionReason?: string;
  status: string;
  requestedBy: Types.ObjectId; // User ID or username
  approvedBy?: string; // User ID or username
}

const FundRequestSchema = new Schema<IFundRequest>(
  {
    projectName: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    categoryName: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    fundReason: {
      type: String,
      required: true,
    },
    fundAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    receiptRequired: {
      type: Boolean,
      required: true,
    },
    receiptURL: {
      type: String,
    },
    exemptionReason: {
      type: String,
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

FundRequestSchema.pre(/^find/, function (next) {
  this.select('-__v -_id -updatedAt -createdAt')
    .populate({
      path: 'projectName',
      select: '-__v -_id',
    })
    .populate({
      path: 'categoryName',
      select: '-__v -_id',
    })
    .populate({
      path: 'requestedBy',
      select: '-__v -_id',
    });

  next();
});
const Fund = model<IFundRequest>('FundRequest', FundRequestSchema);

export default Fund;
