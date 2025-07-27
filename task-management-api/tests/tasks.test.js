const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the configured app
const Task = require('../models/Task');

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Management API', () => {
  describe('POST /tasks', () => {
    it('should create a new task with valid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          category: 'Testing',
          priority: 'High',
          deadline: '2025-12-31T00:00:00.000Z',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.task).toHaveProperty('title', 'Test Task');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ category: 'Testing' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('"title" is required');
    });
  });

  describe('GET /tasks', () => {
    beforeEach(async () => {
      await Task.insertMany([
        { title: 'Task 1', category: 'Dev', priority: 'High', deadline: '2025-11-20T00:00:00.000Z' },
        { title: 'Task 2', category: 'Test', priority: 'Low', deadline: '2025-12-15T00:00:00.000Z' },
      ]);
    });

    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
    });

    it('should filter tasks by priority', async () => {
        const res = await request(app).get('/tasks?priority=High');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].priority).toBe('High');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should retrieve a single task by its id', async () => {
        const task = await Task.create({ title: 'Single Task', category: 'Single', priority: 'Medium', deadline: '2025-10-10T00:00:00.000Z' });
        const res = await request(app).get(`/tasks/${task._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Single Task');
    });

    it('should return 404 if task not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/tasks/${nonExistentId}`);
        expect(res.statusCode).toEqual(404);
    });
  });
  
  describe('PUT /tasks/:id', () => {
    it('should update a task successfully', async () => {
        const task = await Task.create({ title: 'Old Title', category: 'Update', priority: 'Low', deadline: '2025-09-09T00:00:00.000Z' });
        const res = await request(app)
            .put(`/tasks/${task._id}`)
            .send({ title: 'New Updated Title' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.task.title).toBe('New Updated Title');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task successfully', async () => {
        const task = await Task.create({ title: 'To Be Deleted', category: 'Delete', priority: 'Low', deadline: '2025-08-08T00:00:00.000Z' });
        const res = await request(app).delete(`/tasks/${task._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task deleted successfully');

        const foundTask = await Task.findById(task._id);
        expect(foundTask).toBeNull();
    });
  });
});