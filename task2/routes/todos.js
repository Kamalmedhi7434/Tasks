const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware to check database connection
const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please check MongoDB Atlas IP whitelist settings.'
    });
  }
  next();
};

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(checkDatabaseConnection);

// @route   POST /api/todos
// @desc    Create a new TODO
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Create new TODO
    const todo = new Todo({
      title,
      description,
      user: req.user._id
    });

    await todo.save();

    res.status(201).json({
      success: true,
      message: 'TODO created successfully',
      todo
    });

  } catch (error) {
    console.error('Create TODO error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating TODO'
    });
  }
});

// @route   GET /api/todos
// @desc    Get all TODOs for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: todos.length,
      todos
    });

  } catch (error) {
    console.error('Get TODOs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching TODOs'
    });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a TODO
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todoId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TODO ID'
      });
    }

    // Find TODO and check ownership
    const todo = await Todo.findOne({ _id: todoId, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'TODO not found or you do not have permission to update it'
      });
    }

    // Update fields if provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.json({
      success: true,
      message: 'TODO updated successfully',
      todo
    });

  } catch (error) {
    console.error('Update TODO error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating TODO'
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a TODO
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TODO ID'
      });
    }

    // Find and delete TODO (only if owned by user)
    const todo = await Todo.findOneAndDelete({ _id: todoId, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'TODO not found or you do not have permission to delete it'
      });
    }

    res.json({
      success: true,
      message: 'TODO deleted successfully',
      todo
    });

  } catch (error) {
    console.error('Delete TODO error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting TODO'
    });
  }
});

module.exports = router;

