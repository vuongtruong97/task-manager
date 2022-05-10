const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const { SECRET_KEY } = process.env

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = await User.findOne({
            id: decoded.id,
            'tokens.token': token,
        })
        if (!user) {
            throw new Error('')
        }
        return next()
    } catch (e) {
        console.log(e)
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = auth
