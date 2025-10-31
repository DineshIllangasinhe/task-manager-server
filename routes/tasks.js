const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/tasksController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/stats/dashboard', authenticateJWT, taskCtrl.getDashboardStats);
router.get('/', authenticateJWT, taskCtrl.listTasksValidators, taskCtrl.listTasks);
router.post('/', authenticateJWT, taskCtrl.createTaskValidators, taskCtrl.createTask);
router.put('/:id', authenticateJWT, taskCtrl.updateTaskValidators, taskCtrl.updateTask);
router.get('/:id', authenticateJWT, taskCtrl.getTask);
router.delete('/:id', authenticateJWT, taskCtrl.deleteTask);

module.exports = router;