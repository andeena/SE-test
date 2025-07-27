const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;