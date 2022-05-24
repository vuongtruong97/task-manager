const auth = require('../middlewares/authentication')
const maintenance = require('../middlewares/maintenance')
const indexRouter = require('./home.route')
const taskRouter = require('./task.route')
const userRouter = require('./user.route')
const oauthRouter = require('./oauth.route')

function configRouter(app) {
    // app.use(maintenance)
    app.use('/oauth', oauthRouter)
    app.use('/users', userRouter)
    app.use('/tasks', auth, taskRouter)
    app.use('', indexRouter)
}

module.exports = configRouter
