const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const { SECRET_KEY } = process.env

const auth = async (req, res, next) => {
    try {
        //get token from req header
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = await jwt.verify(token, SECRET_KEY)

        //get user with both id and token match
        const user = await User.findOne({
            id: decoded.id,
            'tokens.token': token,
        })

        if (!user) {
            throw new Error('')
        }

        // defined token for session, device logged
        req.token = token
        //if verified send user over req to next fn
        req.user = user
        return next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = auth

//
// const auth = async (req, res, next) => {
//     try {
//         const token = req.signedCookies.TOKEN
//         const decoded = jwt.verify(token, SECRET_KEY)
//         const user = await User.findOne({
//             id: decoded.id,
//             'tokens.token': token,
//         })
//         if (!user) {
//             throw new Error('')
//         }
//         return next()
//     } catch (e) {
//         console.log(e)
//         res.status(401).send({ error: 'Please authenticate' })
//     }
// }
// module.exports = auth
