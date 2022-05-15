const express = require('express')

const oauthRouter = express.Router()

oauthRouter.get('/google', (req, res) => {
    console.log(req)
    res.send(req)
})

module.exports = oauthRouter
