const User = require('../models/User.model')
const bcrypt = require('bcrypt')

class UserController {
    //[POST] /users
    async createUser(req, res) {
        try {
            let { password, email } = req.body
            const isExist = await User.findOne({ email })
            if (isExist) {
                return res.status(400).json({ error: 'Email already exists' })
            }
            if (!isExist) {
                let newUser = new User({
                    ...req.body,
                })
                if (password) {
                    if (password.trim().length < 8) {
                        return res.status(400).json({
                            error: 'Password is must be least 8 characters long',
                        })
                    }
                    if (password.toLowerCase().includes('password')) {
                        console.log(password)
                        return res.status(400).json({
                            error: 'Password does\'n contain "password"',
                        })
                    }
                    const hashPassword = await bcrypt.hash(password, 10)
                    newUser.password = hashPassword
                }
                await newUser.save()
                res.status(201).json(newUser)
            }
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }
    //[GET] /users
    async getAllUsers(req, res) {
        try {
            const users = await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[GET] /users/:id
    async getUser(req, res) {
        try {
            const { id } = req.params
            const user = await User.findById(id)
            console.log(id)
            if (!user) {
                return res.status(404).send()
            }
            res.status(200).json(user)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[PATCH] /users/:id
    async updateUser(req, res) {
        const listUpdates = Object.keys(req.body)
        const allowUpdates = [
            'firstName',
            'lastName',
            'email',
            'age',
            'gender',
            'address',
            'password',
            'role',
        ]
        const isAllowUpdate = listUpdates.every((update) =>
            allowUpdates.includes(update)
        )
        if (!isAllowUpdate) {
            return res.status(400).json({ error: 'Invalid updates!' })
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            )
            res.status(200).json(updatedUser)
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

module.exports = new UserController()
