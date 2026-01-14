const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   POST /tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = await Task.create({
            title,
            description: description || '',
            status: status || 'pending',
            userId: req.userId
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error while creating task' });
    }
});

// @route   GET /tasks
// @desc    Get all tasks for current user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;

        // Build query
        const query = { where: { userId: req.userId } };

        if (status && ['pending', 'completed'].includes(status)) {
            query.where.status = status;
        }

        if (search) {
            const { Op } = require('sequelize');
            query.where.title = { [Op.like]: `%${search}%` };
        }

        query.order = [['createdAt', 'DESC']];

        const tasks = await Task.findAll(query);

        res.json({ tasks });
    } catch (error) {
        console.error('Fetch tasks error:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

// @route   GET /tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Fetch task error:', error);
        res.status(500).json({ message: 'Server error while fetching task' });
    }
});

// @route   PUT /tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined && ['pending', 'completed'].includes(status)) {
            task.status = status;
        }

        await task.save();

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error while updating task' });
    }
});

// @route   DELETE /tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const result = await Task.destroy({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!result) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

module.exports = router;
