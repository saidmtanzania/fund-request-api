import { Schema, model, Document, Types } from 'mongoose';

export interface IRequest extends Document {
  staff: Types.ObjectId;
  project: Types.ObjectId;
  category: Types.ObjectId;
  fund_reason: string;
  fund_amount: number;
  status: string;
  issued_by: Types.ObjectId;
  fund_feedback?: string;
  isfileUpload?: boolean;
  uploadStatus?: boolean;
  uploadDoc?: string;
}

const requestSchema = new Schema<IRequest>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff is required!'],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required!'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required!'],
  },
  fund_reason: {
    type: String,
    required: [true, 'fund reason is required!'],
  },
  fund_amount: {
    type: Number,
    required: [true, 'fund amoount is required!'],
  },
  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending',
  },
  issued_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fund_feedback: String,
  isfileUpload: Boolean,
  uploadStatus: Boolean,
  uploadDoc: String,
});

const fundRequest = model<IRequest>('fundRequest', requestSchema);

export default fundRequest;
