const Task = require('../models/Task');
const { taskSchema, updateTaskSchema } = require('../validators/taskValidator');

const createTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { title, description, category, priority, deadline } = req.body;
  const task = await Task.create({ title, description, category, priority, deadline });
  res.status(201).json({ message: 'Task created successfully', task });
};

const getTasks = async (req, res) => {
  const { category, priority, deadlineStart, deadlineEnd, sortBy, order } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (deadlineStart || deadlineEnd) {
    filter.deadline = {};
    if (deadlineStart) filter.deadline.$gte = new Date(deadlineStart);
    if (deadlineEnd) filter.deadline.$lte = new Date(deadlineEnd);
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  const tasks = await Task.find(filter).sort(sortOptions);
  res.status(200).json(tasks);
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json(task);
};

const updateTask = async (req, res) => {
  const { error } = updateTaskSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ message: 'Task updated successfully', task });
};

const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };