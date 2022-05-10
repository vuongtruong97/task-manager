const express = require('express')
const auth = require('../middlewares/authentication')

const UserController = require('../controllers/User.controller')

const userRouter = express.Router()

userRouter.post('/login', UserController.loginUser)
userRouter.post('/register', UserController.createUser)

userRouter.patch('/:id', auth, UserController.updateUser)
userRouter.delete('/:id', auth, UserController.deleteUser)

userRouter.get('/:id', auth, UserController.getUser)
userRouter.get('', auth, UserController.getAllUsers)

module.exports = userRouter
