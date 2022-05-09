const express = require('express')
const UserController = require('../controllers/User.controller')

const userRouter = express.Router()

userRouter.post('', UserController.createUser)
userRouter.get('/:id', UserController.getUser)
userRouter.patch('/:id', UserController.updateUser)
userRouter.get('', UserController.getAllUsers)

module.exports = userRouter
