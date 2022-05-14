const express = require('express')
const TaskController = require('../controllers/Task.controller')
const auth = require('../middlewares/authentication')
const checkPerm = require('../middlewares/checkPerm')

const taskRouter = express.Router()

taskRouter.get('/count', auth, checkPerm, TaskController.countTask)
taskRouter.get('/own-tasks', auth, checkPerm, TaskController.getOwnTasks)
taskRouter.get('/:id', auth, checkPerm, TaskController.getTask)
taskRouter.get('', auth, checkPerm, TaskController.getAllTasks)

taskRouter.post('', auth, TaskController.addTask)

taskRouter.patch('/:id', auth, TaskController.updateTask)

taskRouter.delete('/:id', auth, TaskController.deleteTask)

module.exports = taskRouter
