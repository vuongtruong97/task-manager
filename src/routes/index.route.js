const express = require('express')

const indexRouter = express.Router()

indexRouter.get('', (req, res) => {
    res.send('<h1>Home Page</h1>')
})
module.exports = indexRouter
