const express = require('express')
const auth = require('../middlewares/authentication')
const checkPerm = require('../middlewares/checkPerm')
const { avatarUpload } = require('../lib/multer')
const UserController = require('../controllers/User.controller')
const logger = require('../lib/logger/winston')

//custom express error handler
const errHandler = (err, req, res, next) => {
    logger.error(`[User Router Error] ${err.name} ${err.message}`)
    res.status(400).json({ success: false, error: err.name, message: err.message })
}

const userRouter = express.Router()

userRouter.post('/login', UserController.loginUser)
userRouter.post('/register', avatarUpload.single('avatar'), UserController.createUser)
userRouter.post('/me/avatar', auth, avatarUpload.single('avatar'), UserController.updateAvatar, errHandler)
userRouter.post('/logout', auth, UserController.logoutUser)
userRouter.post('/logout-all', auth, UserController.logoutAll)

userRouter.patch('/me', auth, checkPerm, UserController.updateOwnProfile)
userRouter.patch('/:id', auth, checkPerm, UserController.updateUser)

userRouter.delete('/me', auth, UserController.deleteOwnProfile)
userRouter.delete('/me/avatar', auth, UserController.deleteAvatar)
userRouter.delete('/:id', auth, checkPerm, UserController.deleteUser)

userRouter.get('/me', auth, UserController.getProfile)
userRouter.get('/:id/avatar', UserController.getUserAvatar)
userRouter.get('/:id', auth, checkPerm, UserController.getUser)
userRouter.get('', auth, checkPerm, UserController.getAllUsers)

module.exports = userRouter
