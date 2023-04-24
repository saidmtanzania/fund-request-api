/* eslint-disable func-names */
// Import Mongoose and define types
import mongoose, { Document, Schema, Model, Types } from 'mongoose';

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

const monthlyAmountUsedSchema: Schema = new Schema<IUsedAmount>({
  month: { type: Date, required: true },
  amountUsed: { type: Number, required: true },
});

// Define BudgetItem Schema
const budgetItemSchema: Schema = new Schema<IBudgetItem>({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  monthlyAmountsUsed: [monthlyAmountUsedSchema],
});

// Define Budget Schema
const budgetSchema: Schema = new Schema<IBudget>({
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
  // Calculate total amount by summing up amounts of all budget items
  const totalAmount = this.items.reduce((acc, budgetItem) => acc + budgetItem.amount, 0);

  // Set the calculated total amount to the totalAmount field
  this.totalAmount = totalAmount;

  // Continue saving the document
  next();
});

// Create Budget model
const Budget: Model<IBudget> = mongoose.model<IBudget>('Budget', budgetSchema);

// Export the models
export default Budget;
