const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional().allow(''),
  category: Joi.string().min(3).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  deadline: Joi.date().iso().required(),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().optional().allow(''),
    category: Joi.string().min(3),
    priority: Joi.string().valid('Low', 'Medium', 'High'),
    deadline: Joi.date().iso(),
}).min(1); 

module.exports = { taskSchema, updateTaskSchema };