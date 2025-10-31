const { Task, User } = require('../models');
const { body, validationResult, param, query } = require('express-validator');

const createTaskValidators = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().toDate(),
    body('assignedToId').optional().isInt({ min: 1 }).toInt()
];

const listTasksValidators = [
    query('completed').optional().isIn(['true', 'false'])
];

const listTasks = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const { completed } = req.query;
        const where = {};
        if (completed === 'true') where.completed = true;
        if (completed === 'false') where.completed = false;

        const tasks = await Task.findAll({
            where,
            include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ tasks });
    } catch (err) {
        next(err);
    }
};

const getTask = async (req, res, next) => {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: [{ model: User, as: 'assignee', attributes: ['id','name','email'] }]
      });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json({ task });
    } catch (err) {
      next(err);
    }
  };

const createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const { title, description, dueDate, assignedToId } = req.body;

        let assignee = null;
        if (assignedToId) {
            assignee = await User.findByPk(assignedToId);
            if (!assignee) return res.status(422).json({ error: 'Assigned user not found' });
        }

        const task = await Task.create({ title, description, dueDate, assignedToId: assignedToId || null });
        res.status(200).json({ message: 'Task created successfully', task });
    } catch (err) {
        next(err);
    }
};

const updateTaskValidators = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().toDate(),
    body('assignedToId').optional().custom((value) => {
        if (value === null || value === '' || value === undefined) return true;
        const intValue = parseInt(value, 10);
        if (isNaN(intValue) || intValue < 1) throw new Error('Invalid user ID');
        return true;
    }),
    body('completed').optional().isBoolean()
];

const updateTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const { id } = req.params;
        const { title, description, dueDate, assignedToId, completed } = req.body;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (assignedToId !== undefined) {
            if (assignedToId === null || assignedToId === '') {
                task.assignedToId = null;
            } else {
                const assignee = await User.findByPk(assignedToId);
                if (!assignee) return res.status(422).json({ error: 'Assigned user not found' });
                task.assignedToId = assignedToId;
            }
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (completed !== undefined) task.completed = completed;

        await task.save();

        await task.reload({
            include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }]
        });

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listTasksValidators,
    listTasks,
    createTaskValidators,
    createTask,
    updateTaskValidators,
    updateTask,
    getTask,
};