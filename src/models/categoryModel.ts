import * as mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please specify project name!'],
  },
});

// categorySchema.plugin(softDel);

const Category = mongoose.model('Category', categorySchema);

export default Category;
