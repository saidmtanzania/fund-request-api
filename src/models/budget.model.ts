/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
// Import Mongoose and define types
import { Document, Schema, model, Types } from 'mongoose';

// Define interface for BudgetItem

interface IUsedAmount extends Document {
  month: Date;
  amountUsed: number;
}
// Define interface for BudgetItem
interface IBudgetItem {
  project: Types.ObjectId;
  category: Types.ObjectId;
  amount: number;
  monthlyAmountsUsed: IUsedAmount[];
}

// Define interface for Budget
interface IBudget extends Document {
  month: Date;
  items: IBudgetItem[];
  carryOverAmount?: number;
  totalAmount?: number;
}

// Define MonthlyUsedAmount Schema
const monthlyAmountUsedSchema = new Schema<IUsedAmount>({
  month: { type: Date, required: true },
  amountUsed: { type: Number, required: true },
});

// Define BudgetItem Schema
const budgetItemSchema = new Schema<IBudgetItem>({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  monthlyAmountsUsed: [monthlyAmountUsedSchema],
});

// Define Budget Schema
const budgetSchema = new Schema<IBudget>({
  month: { type: Date, required: true },
  items: { type: [budgetItemSchema] },
  carryOverAmount: { type: Number },
  totalAmount: { type: Number },
});

budgetSchema.pre(/^find/, function (next) {
  this.select(' -__v')
    .populate({
      path: 'items.project',
      select: '-__v',
    })
    .populate({
      path: 'items.category',
      select: '-__v',
    });

  next();
});

// Define a pre-save middleware function for Budget schema
budgetSchema.pre<IBudget>('save', function (next) {
  const totalAmount = this.items.reduce((acc, budgetItem) => acc + budgetItem.amount, 0);
  this.totalAmount = totalAmount;
  next();
});

const Budget = model<IBudget>('Budget', budgetSchema);

export default Budget;
