const User = require('../models/User.model')
const sharp = require('sharp')
const Email = require('../lib/nodemailer')

class UserController {
    //[POST] /users/register
    async createUser(req, res) {
        try {
            let { email } = req.body

            const isExists = await User.findOne({ email })
            if (isExists) {
                return res.status(400).json({ error: 'Email already exists' })
            }
            const newUser = new User(req.body)

            await newUser.save()

            const nodemail = new Email(newUser)
            nodemail.sendWellCome()

            const token = await newUser.generateAuthToken()
            res.status(201).json({ newUser, token })
        } catch (error) {
            res.status(400).json({ [error.name]: error.message })
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
        const allowUpdates = ['firstName', 'lastName', 'email', 'age', 'gender', 'address', 'password', 'role']
        const isAllowUpdate = listUpdates.every((update) => allowUpdates.includes(update))
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
    //[PATCH] /user/me
    async updateOwnProfile(req, res) {
        try {
            const _id = req.user._id
            const listUpdates = Object.keys(req.body)

            if (listUpdates.length === 0) {
                return res.status(201).json({ success: false, message: 'Nothing updated' })
            }

            const listAllow = Object.keys(User.schema.paths)

            const isAllow = listUpdates.every((update) => {
                return listAllow.includes(update)
            })
            if (!isAllow) {
                return res.status(201).json({ success: false, message: 'Invalid update field' })
            }

            const user = req.user

            listUpdates.forEach((update) => (user[update] = req.body[update]))
            await user.save()
            res.json(user)
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
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
    //[DELETE] /user/me
    async deleteOwnProfile(req, res) {
        try {
            const id = req.user._id
            const user = await User.findById(id)

            await user.remove()
            const nodemail = new Email(user)
            nodemail.sendCancelation()
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
    //[POST] /users/login
    async loginUser(req, res) {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()

            res.cookie('TOKEN', token, { signed: true })
            res.json({ user, token })
        } catch (error) {
            res.status(400).json({
                [error.name]: error.message,
            })
        }
    }
    //[GET] /users/me
    async getProfile(req, res) {
        try {
            res.status(200).json(req.user)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    //[POST] /users/logout
    async logoutUser(req, res) {
        try {
            const user = req.user
            user.tokens = user.tokens.filter((token) => token.token !== req.token)
            await user.save()

            res.status(200).send()
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[POST] /users/logout-all
    async logoutAll(req, res) {
        try {
            const user = req.user
            user.tokens = []
            await user.save()
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    //[POST] /users/me/avatar
    async updateAvatar(req, res, next) {
        try {
            const user = req.user
            console.log(req.file)
            if (!req.file) {
                throw { name: 'Upload error', message: 'Please select an image to upload' }
            }
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).webp().toBuffer()
            const avatar = {
                contentType: 'image/webp',
                data: buffer,
            }
            user.avatar = avatar
            await user.save()

            res.status(200).json(user)
        } catch (error) {
            next(error)
            // res.status(400).json({ [error.name]: error.message })
        }
    }
    //[DELETE] /users/me/avatar
    async deleteAvatar(req, res, next) {
        try {
            const user = req.user
            user.avatar = undefined
            await user.save()
            res.status(200).send()
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[GET] /users/:id/avatar
    async getUserAvatar(req, res) {
        try {
            const user = await User.findById(req.params.id)
            if (!user || !user.avatar) {
                throw new Error('Not found')
            }
            res.set('Content-Type', user.avatar.contentType)
            res.send(user.avatar.data)
        } catch (error) {
            console.log(error)
            res.status(400).json({ [error.name]: error.message })
        }
    }
}

module.exports = new UserController()
