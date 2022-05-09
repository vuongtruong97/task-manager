const express = require('express')
const TaskController = require('../controllers/Task.controller')

const taskRouter = express.Router()

taskRouter.delete('/:id', TaskController.deleteTask)
taskRouter.post('', TaskController.addTask)
taskRouter.patch('/:id', TaskController.updateTask)
taskRouter.get('/count', TaskController.countTask)
taskRouter.get('/:id', TaskController.getTask)
taskRouter.get('', TaskController.getAllTasks)

module.exports = taskRouter
