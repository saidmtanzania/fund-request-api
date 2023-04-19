/* eslint-disable func-names */
// Import Mongoose and define types
import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Define interface for BudgetItem
interface IBudgetItem {
  project: Types.ObjectId;
  category: Types.ObjectId;
  amount: number;
}

// Define interface for Budget
interface IBudget extends Document {
  month: string;
  items: IBudgetItem[];
  carryOverAmount?: number;
}

// Define BudgetItem Schema
const budgetItemSchema: Schema = new Schema<IBudgetItem>({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
});

// Define Budget Schema
const budgetSchema: Schema = new Schema<IBudget>({
  month: { type: String, required: true },
  items: { type: [budgetItemSchema] },
  carryOverAmount: { type: Number },
});

budgetSchema.pre(/^find/, function (next) {
  this.select(' -__v')
    .populate({
      path: 'items.project',
      select: '-__v -_id',
    })
    .populate({
      path: 'items.category',
      select: '-__v -_id',
    });

  next();
});
// Create BudgetItem model
// const BudgetItem: Model<IBudgetItem> = mongoose.model<IBudgetItem>('BudgetItem', budgetItemSchema);

// Create Budget model
const Budget: Model<IBudget> = mongoose.model<IBudget>('Budget', budgetSchema);

// Export the models
export default Budget;
