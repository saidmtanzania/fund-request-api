import * as mongoose from 'mongoose';
// const softDel = require('mongoose-delete');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please specify project name!'],
  },
});

// projectSchema.plugin(softDel);

const Project = mongoose.model('Project', projectSchema);

export default Project;
