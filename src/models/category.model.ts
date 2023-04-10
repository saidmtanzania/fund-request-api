import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please specify project name!'],
  },
});

// categorySchema.plugin(softDel);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
