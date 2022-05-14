const Task = require('../models/Task.model')
const User = require('../models/User.model')

class TaskController {
    //[POST] /tasks
    async addTask(req, res) {
        try {
            const newTask = new Task({ ...req.body, owner: req.user._id })

            await newTask.save()
            res.status(201).json(newTask)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    //[GET] /tasks
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find()
            return res.status(200).json(tasks)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    //[GET] /tasks/own-tasks
    async getOwnTasks(req, res) {
        try {
            //method: 1
            // const tasks = await Task.find({ owner: req.user._id })

            // method: 2  -> highter performent

            const user = req.user

            // const limit = parseInt(req.query.limit)
            // const skip = (parseInt(req.query.page) - 1) * limit
            const match = {}
            const sort = {}

            if (req.body.filter) {
                match = { ...filter }
            }
            if (req.body.sort) {
                sort = { ...sort }
            }
            if (req.body.paging) {
            }
            if (req.query.completed) {
                match.completed = req.query.completed === 'true'
            }

            if (req.query.sort) {
                // const sort = req.query.sort (url?sort=-createdAt)
                const parts = req.query.sort.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }

            await user.populate({ path: 'tasks', match, options: { limit, skip, sort } })

            return res.status(200).json(user.tasks)
        } catch (error) {
            res.status(400).json({ [error.name]: error.message })
        }
    }
    //[GET] /tasks/:id
    async getTask(req, res) {
        try {
            const _id = req.params.id
            const task = await Task.findOne({ _id, owner: req.user._id })

            if (!task) {
                return res.status(404).json({ error: 'Task not found' })
            }
            await task.populate('owner')
            res.status(200).json(task)
        } catch (error) {
            res.status(500).json({ [error.name]: error.message })
        }
    }
    //[PATCH] /tasks/:id
    async updateTask(req, res) {
        const updates = Object.keys(req.body)
        const allowUpdate = Object.keys(Task.schema.paths)

        if (updates.length === 0) {
            return res.status(201).json({ success: false, message: 'Nothing to update' })
        }
        // check req update field
        const isAllow = updates.every((update) => allowUpdate.includes(update))
        if (!isAllow) {
            return res.status(400).json({ error: 'Invalid updates!' })
        }
        try {
            const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
            if (!task) {
                return res.status(404).json({ error: 'Task not found' })
            }
            updates.forEach((update) => (task[update] = req.body[update]))
            await task.save()

            res.json(task)
        } catch (error) {
            res.status(400).json({ [error.name]: error.message })
        }
    }
    //[DELETE] /tasks/:id
    async deleteTask(req, res) {
        try {
            const { id } = req.params
            const result = await Task.findOneAndDelete({ _id: id, owner: req.user._id })
            if (!result) {
                return res.status(400).json({ error: 'Task not found' })
            }
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[GET] /tasks/count
    async countTask(req, res) {
        try {
            const count = await Task.find().estimatedDocumentCount()
            res.status(200).json({ count })
        } catch (error) {
            res.status(500).send()
        }
    }
}

module.exports = new TaskController()
