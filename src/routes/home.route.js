const express = require('express')

const indexRouter = express.Router()

indexRouter.get('', (req, res) => {
    res.send('<h1>Well Come To Express Task Manager API</h1>')
})
module.exports = indexRouter
