const indexRouter = require('./home.route')
const taskRouter = require('./task.route')
const userRouter = require('./user.route')

function configRouter(app) {
    app.use('/users', userRouter)
    app.use('/tasks', taskRouter)
    app.use('', indexRouter)
}

module.exports = configRouter
