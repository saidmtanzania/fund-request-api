import { Document, Schema, model } from 'mongoose';

// BudgetItem Interface
export interface IBudgetItem extends Document {
  name: string;
  amount: number;
}

// Budget Interface
export interface IBudget extends Document {
  month: string;
  items: IBudgetItem[];
  carryOverAmount: number;
}

// BudgetItem Schema
const BudgetItemSchema = new Schema<IBudgetItem>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Budget Schema
const BudgetSchema = new Schema<IBudget>({
  month: { type: String, required: true },
  items: [BudgetItemSchema],
  carryOverAmount: { type: Number, default: 0 },
});

const Budget = model<IBudget>('Budget', BudgetSchema);

export default Budget;
