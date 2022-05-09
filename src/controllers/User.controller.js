const User = require('../models/User.model')
const bcrypt = require('bcrypt')

class UserController {
    //[POST] /users
    async createUser(req, res) {
        try {
            let { email } = req.body
            const isExists = await User.findOne({ email })
            if (isExists) {
                return res.status(400).json({ error: 'Email already exists' })
            }
            const newUser = new User(req.body)
            await newUser.save()
            res.status(201).json(newUser)
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
            const user = await User.findById(req.params.id)
            // integate
            listUpdates.forEach((update) => (user[update] = req.body[update]))

            await user.save()

            res.status(200).json(user)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[DELETE] /users/:id
    async deleteUser(req, res) {
        try {
            const userDeleted = await User.findOneAndDelete({
                _id: req.params.id,
            })
            if (!userDeleted) {
                return res.status(400).json({ error: 'User not found' })
            }
            return res.status(204).json({ userDeleted })
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

module.exports = new UserController()
