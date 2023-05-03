import { Schema, Document, model } from 'mongoose';
// const softDel = require('mongoose-delete');
interface IProject extends Document {
  name: string;
}
const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please specify project name!'],
  },
});

// projectSchema.plugin(softDel);

const Project = model<IProject>('Project', projectSchema);

export default Project;
